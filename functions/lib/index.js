"use strict";
// functions/src/index.ts
// Firebase Functions v2
//
// Strategy: On any menu/category change, build a JSON snapshot and write it
// to Firebase Storage at menu-data.json — Firebase Hosting rewrites serve it
// directly from Storage, giving CDN-level performance with zero Firestore reads
// for public users.
//
// FULL AUTOMATIC FLOW:
//  Admin changes menu → Firestore trigger fires → debounce 3s →
//  buildMenuData() → writes to Storage (menu-data.json) →
//  Firebase Hosting CDN serves /menu-data.json →
//  Public users fetch JSON (0 Firestore reads) →
//  sessionStorage caches it for 5 min (0 network requests on revisit)
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishMenuManual = exports.onCategoryChange = exports.onMenuItemChange = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const v2_1 = require("firebase-functions/v2");
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
// ─── Build menu data from Firestore ──────────────────────────────────────
async function buildMenuData() {
    const [categoriesSnap, menuSnap] = await Promise.all([
        db.collection('categories')
            .where('status', '==', 'active')
            .orderBy('placeOrder', 'asc')
            .get(),
        db.collection('menu')
            .where('status', '==', 'active')
            .get(),
    ]);
    const categories = categoriesSnap.docs.map(doc => ({
        uid: doc.id,
        name: doc.data().name,
        placeOrder: doc.data().placeOrder || 0,
    }));
    const items = menuSnap.docs.map(doc => ({
        uid: doc.id,
        name: doc.data().name,
        price: doc.data().price,
        description: doc.data().description || '',
        categoryId: doc.data().categoryId,
        images: doc.data().images || [],
    }));
    return { categories, items, publishedAt: new Date().toISOString() };
}
// ─── Write menu-data.json to Firebase Storage ─────────────────────────────
// Firebase Hosting is configured (in firebase.json) with a rewrite rule that
// maps /menu-data.json → Cloud Storage file → served via CDN.
// The bucket used is the default Firebase Storage bucket: rubino-s.firebasestorage.app
async function publishMenuSnapshot() {
    const data = await buildMenuData();
    const json = JSON.stringify(data);
    // Write to Firebase Storage — the file will be served by Firebase Hosting CDN
    // via the storage source rewrite in firebase.json
    const bucket = admin.storage().bucket(); // uses default bucket: rubino-s.firebasestorage.app
    const file = bucket.file('menu-data.json');
    await file.save(Buffer.from(json, 'utf-8'), {
        metadata: {
            contentType: 'application/json',
            // CDN caches for 5 min; browser cache 1 min
            // Firebase Hosting will respect these headers
            cacheControl: 'public, max-age=60, s-maxage=300',
        },
    });
    // Make the file publicly readable
    await file.makePublic();
    v2_1.logger.info(`✅ menu-data.json published: ${data.categories.length} categories, ${data.items.length} items`);
    return data;
}
// ─── Debounce — prevents burst writes when admin saves multiple items fast ─
async function debouncePublish() {
    var _a;
    const lockRef = db.collection('_system').doc('publishLock');
    const now = Date.now();
    const DEBOUNCE_MS = 3000;
    await lockRef.set({ triggeredAt: now }, { merge: true });
    await new Promise(resolve => setTimeout(resolve, DEBOUNCE_MS));
    const snap = await lockRef.get();
    const latest = ((_a = snap.data()) === null || _a === void 0 ? void 0 : _a.triggeredAt) || 0;
    if (latest > now) {
        v2_1.logger.info('Debounced — skipping duplicate publish');
        return false;
    }
    return true;
}
// ─── Trigger: Menu item changes ───────────────────────────────────────────
exports.onMenuItemChange = (0, firestore_1.onDocumentWritten)({ document: 'menu/{itemId}', timeoutSeconds: 60, memory: '256MiB' }, async () => {
    v2_1.logger.info('Menu item changed — publishing snapshot...');
    if (!(await debouncePublish()))
        return;
    try {
        await publishMenuSnapshot();
    }
    catch (error) {
        v2_1.logger.error('Failed to publish snapshot:', error);
    }
});
// ─── Trigger: Category changes ────────────────────────────────────────────
exports.onCategoryChange = (0, firestore_1.onDocumentWritten)({ document: 'categories/{catId}', timeoutSeconds: 60, memory: '256MiB' }, async () => {
    v2_1.logger.info('Category changed — publishing snapshot...');
    if (!(await debouncePublish()))
        return;
    try {
        await publishMenuSnapshot();
    }
    catch (error) {
        v2_1.logger.error('Failed to publish snapshot:', error);
    }
});
// ─── HTTP Callable: Manual publish (from admin dashboard) ────────────────
exports.publishMenuManual = (0, https_1.onCall)({ timeoutSeconds: 60, memory: '256MiB' }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be logged in');
    }
    try {
        const data = await publishMenuSnapshot();
        return {
            success: true,
            publishedAt: data.publishedAt,
            categoriesCount: data.categories.length,
            itemsCount: data.items.length,
        };
    }
    catch (error) {
        v2_1.logger.error('Manual publish failed:', error);
        throw new https_1.HttpsError('internal', error.message);
    }
});
//# sourceMappingURL=index.js.map