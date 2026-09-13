import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Download, RefreshCw, Palette, Settings, Image as ImageIcon, Sparkles, Type } from "lucide-react";

// Import local assets
import rubTransparent from "../../assets/rub-transparent.png";

type Preset = "rubinos" | "classic" | "custom";

export default function QRCodeGenerator() {
  const url = "https://rubinos-eg.com/menu";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Styling and configuration state
  const [preset, setPreset] = useState<Preset>("rubinos");
  const [foregroundColor, setForegroundColor] = useState("#E5E0C6"); // Rubinos Cream
  const [backgroundColor, setBackgroundColor] = useState("#0E302A"); // Rubinos Dark Green
  const [eyeColor, setEyeColor] = useState("#C89445"); // Rubinos Brass
  const [size, setSize] = useState(350);
  const [margin, setMargin] = useState(2);
  const [logoType, setLogoType] = useState<"rubinos" | "none">("rubinos");
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Editable title states
  const [titleText, setTitleText] = useState("MENU");
  const [showTitle, setShowTitle] = useState(true);

  // Apply theme presets
  useEffect(() => {
    if (preset === "rubinos") {
      setForegroundColor("#E5E0C6"); // Cream
      setBackgroundColor("#0E302A"); // Forest Green
      setEyeColor("#C89445"); // Brass Gold
      setLogoType("rubinos");
    } else if (preset === "classic") {
      setForegroundColor("#000000"); // Black
      setBackgroundColor("#FFFFFF"); // White
      setEyeColor("#000000"); // Black
      setLogoType("none");
    }
  }, [preset]);

  // Handle custom logo uploads
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomLogoUrl(event.target.result as string);
          setLogoType("none"); // switch to custom upload rendering
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate the QR Code with pixel-perfect scannability and eye coloring
  const generateQRCode = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    try {
      // 1. Create QR Code structure to retrieve exact module matrix
      const qr = QRCode.create(url, { errorCorrectionLevel: "H" });
      const modules = qr.modules;
      const modulesCount = modules.size;
      const totalModules = modulesCount + margin * 2;

      // 2. Configure canvas dimensions
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 3. Draw background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, size, size);

      // 4. Calculate layout offsets to leave room for the title text at the bottom if enabled
      const hasTitle = showTitle && titleText.trim().length > 0;
      const qrSize = hasTitle ? size * 0.82 : size;
      const xOffset = (size - qrSize) / 2;
      const yOffset = hasTitle ? 15 : 0;
      const moduleSize = qrSize / totalModules;

      // 5. Draw QR Code modules with pixel-perfect tiling
      for (let row = 0; row < modulesCount; row++) {
        for (let col = 0; col < modulesCount; col++) {
          const isDark = modules.get(row, col);
          if (isDark) {
            // Check if this module is part of the 3 finder patterns (7x7 modules at corners)
            const isTopLeftEye = row < 7 && col < 7;
            const isTopRightEye = row < 7 && col >= modulesCount - 7;
            const isBottomLeftEye = row >= modulesCount - 7 && col < 7;

            if (isTopLeftEye || isTopRightEye || isBottomLeftEye) {
              ctx.fillStyle = eyeColor;
            } else {
              ctx.fillStyle = foregroundColor;
            }

            // Calculate exact position with integer boundary snapping to prevent blurry gaps
            const x = Math.round(xOffset + (col + margin) * moduleSize);
            const y = Math.round(yOffset + (row + margin) * moduleSize);
            const w = Math.round(xOffset + (col + margin + 1) * moduleSize) - x;
            const h = Math.round(yOffset + (row + margin + 1) * moduleSize) - y;

            ctx.fillRect(x, y, w, h);
          }
        }
      }

      // 6. Draw Center Logo Overlay if configured
      const logoSrc = customLogoUrl || (logoType === "rubinos" ? rubTransparent : null);

      if (logoSrc) {
        const logoSize = qrSize * 0.22;
        const x = xOffset + (qrSize - logoSize) / 2;
        const y = yOffset + (qrSize - logoSize) / 2;

        // Draw clear background backing (rounded square) for the logo to clear overlapping patterns
        ctx.fillStyle = backgroundColor;
        const padding = 6;
        const rectSize = logoSize + padding * 2;
        const rx = x - padding;
        const ry = y - padding;

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(rx, ry, rectSize, rectSize, 12);
        } else {
          ctx.rect(rx, ry, rectSize, rectSize);
        }
        ctx.fill();

        // Draw border for the logo card
        ctx.strokeStyle = eyeColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw the logo image
        const img = new Image();
        img.src = logoSrc;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            ctx.drawImage(img, x, y, logoSize, logoSize);
            resolve();
          };
          img.onerror = () => {
            console.error("Failed to load logo image");
            reject();
          };
        });
      }

      // 7. Draw Title Text below the QR Code
      if (hasTitle) {
        ctx.fillStyle = foregroundColor;
        const fontSize = Math.round(size * 0.08); // 8% of canvas size
        ctx.font = `bold ${fontSize}px "Clash Display", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const remainingSpaceY = size - (yOffset + qrSize);
        const textY = yOffset + qrSize + (remainingSpaceY / 2);

        ctx.fillText(titleText.toUpperCase(), size / 2, textY);
      }
    } catch (err) {
      console.error("Error generating styled QR code", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Re-generate QR Code whenever parameters change
  useEffect(() => {
    generateQRCode();
  }, [foregroundColor, backgroundColor, eyeColor, size, margin, logoType, customLogoUrl, titleText, showTitle]);

  // Download QR Code as a high-res PNG image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `rubinos-menu-qrcode-${preset}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="w-full bg-[#0d1c19]/80 backdrop-blur-md rounded-2xl border border-[#1b3d37] p-6 lg:p-8 text-[#e8dfd7] shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#1b3d37] pb-6 mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-head text-[#C89445] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#C89445] animate-pulse" />
            Menu QR Code Generator
          </h2>
          <p className="text-sm text-[#e8dfd7]/70 mt-1 font-body">
            Generate and style a high-quality QR code linking directly to Rubinos Menu.
          </p>
        </div>
        <button
          onClick={generateQRCode}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-[#1b3d37] hover:bg-[#25524a] text-white rounded-lg text-sm font-semibold transition-all duration-300 border border-[#2d6157] disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
          Regenerate
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls: Left Panel */}
        <div className="lg:col-span-7 space-y-6">

          {/* Preset Selector */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#C89445] flex items-center gap-2">
              <Palette className="w-4 h-4" /> Style Preset
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPreset("rubinos")}
                className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all duration-300 text-center ${
                  preset === "rubinos"
                    ? "bg-[#C89445]/20 border-[#C89445] text-[#C89445]"
                    : "bg-[#0E302A]/40 border-[#1b3d37] hover:border-[#C89445]/50 text-[#e8dfd7]/80"
                }`}
              >
                🌊 Seaworthy
              </button>
              <button
                type="button"
                onClick={() => setPreset("classic")}
                className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all duration-300 text-center ${
                  preset === "classic"
                    ? "bg-white/10 border-white text-white"
                    : "bg-[#0E302A]/40 border-[#1b3d37] hover:border-white/50 text-[#e8dfd7]/80"
                }`}
              >
                🏁 Classic B&W
              </button>
            </div>
          </div>

          {/* Color Settings */}
          <div className="space-y-4 bg-[#0E302A]/30 p-5 rounded-xl border border-[#1b3d37]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#C89445] border-b border-[#1b3d37] pb-2">
              <Settings className="w-4 h-4" /> Color Customization
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Background Color */}
              <div className="space-y-2">
                <label className="text-xs text-[#e8dfd7]/80 block">Background</label>
                <div className="flex items-center gap-2 bg-[#0E302A]/50 p-2 rounded-lg border border-[#1b3d37]">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => {
                      setBackgroundColor(e.target.value);
                      setPreset("custom");
                    }}
                    className="w-8 h-8 rounded border border-transparent cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono select-all uppercase">{backgroundColor}</span>
                </div>
              </div>

              {/* QR Pattern Color */}
              <div className="space-y-2">
                <label className="text-xs text-[#e8dfd7]/80 block">QR Pixels</label>
                <div className="flex items-center gap-2 bg-[#0E302A]/50 p-2 rounded-lg border border-[#1b3d37]">
                  <input
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => {
                      setForegroundColor(e.target.value);
                      setPreset("custom");
                    }}
                    className="w-8 h-8 rounded border border-transparent cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono select-all uppercase">{foregroundColor}</span>
                </div>
              </div>

              {/* Eye/Finder Color */}
              <div className="space-y-2">
                <label className="text-xs text-[#e8dfd7]/80 block">Eye Corners</label>
                <div className="flex items-center gap-2 bg-[#0E302A]/50 p-2 rounded-lg border border-[#1b3d37]">
                  <input
                    type="color"
                    value={eyeColor}
                    onChange={(e) => {
                      setEyeColor(e.target.value);
                      setPreset("custom");
                    }}
                    className="w-8 h-8 rounded border border-transparent cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono select-all uppercase">{eyeColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title / Text Customization (Editable Title) */}
          <div className="space-y-4 bg-[#0E302A]/30 p-5 rounded-xl border border-[#1b3d37]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#C89445] border-b border-[#1b3d37] pb-2">
              <Type className="w-4 h-4" /> Title Text Customization
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showTitle"
                  checked={showTitle}
                  onChange={(e) => setShowTitle(e.target.checked)}
                  className="w-4 h-4 accent-[#C89445]"
                />
                <label htmlFor="showTitle" className="text-xs text-[#e8dfd7] font-semibold cursor-pointer select-none">
                  Display Title Text
                </label>
              </div>

              <div className="md:col-span-8">
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  placeholder="e.g. MENU"
                  disabled={!showTitle}
                  className="w-full px-3 py-2 text-xs bg-[#0E302A]/50 border border-[#1b3d37] rounded-lg text-white font-mono focus:outline-none focus:border-[#C89445] disabled:opacity-40 transition-all uppercase"
                />
              </div>
            </div>
          </div>

          {/* Logo Options */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#C89445] flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Center Logo Overlay
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setLogoType("rubinos");
                  setCustomLogoUrl(null);
                }}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  logoType === "rubinos" && !customLogoUrl
                    ? "bg-[#C89445]/20 border-[#C89445] text-[#C89445]"
                    : "bg-[#0E302A]/40 border-[#1b3d37] text-[#e8dfd7]/80 hover:border-[#C89445]/30"
                }`}
              >
                👑 Rubinos PNG
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoType("none");
                  setCustomLogoUrl(null);
                }}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  logoType === "none" && !customLogoUrl
                    ? "bg-[#1b3d37] border-slate-500 text-white"
                    : "bg-[#0E302A]/40 border-[#1b3d37] text-[#e8dfd7]/80 hover:border-slate-500/30"
                }`}
              >
                🚫 No Logo
              </button>
            </div>

            {/* Custom Logo Upload */}
            <div className="mt-3">
              <label className="block text-xs text-[#e8dfd7]/60 mb-1">Or upload a custom square logo (.png or .jpg):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="block w-full text-xs text-[#e8dfd7]/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1b3d37] file:text-white hover:file:bg-[#25524a] cursor-pointer"
              />
            </div>
          </div>

          {/* Size & Layout Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>QR CODE SIZE</span>
                <span className="text-[#C89445] font-mono">{size}px</span>
              </div>
              <input
                type="range"
                min="250"
                max="600"
                step="10"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-[#C89445]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>QUIET ZONE (MARGIN)</span>
                <span className="text-[#C89445] font-mono">{margin} modules</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full accent-[#C89445]"
              />
            </div>
          </div>

        </div>

        {/* Live Preview & Download: Right Panel */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#0d1c19]/60 p-6 rounded-2xl border border-[#1b3d37] space-y-6">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#C89445]">Live Scannable Preview</span>

          {/* Card containing canvas */}
          <div
            className="p-4 rounded-2xl border flex items-center justify-center transition-all duration-500 shadow-lg"
            style={{
              backgroundColor: backgroundColor,
              borderColor: eyeColor,
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                maxWidth: "280px",
                height: "auto",
                aspectRatio: "1/1",
              }}
              className="rounded-lg"
            />
          </div>

          {/* Target URL Badge */}
          <div className="w-full max-w-[280px] bg-[#0E302A]/80 border border-[#1b3d37] px-3 py-2 rounded-lg text-center">
            <span className="text-[10px] text-[#e8dfd7]/50 block uppercase tracking-wider font-bold">Target Link</span>
            <span className="text-xs font-mono text-[#C89445] truncate block font-bold select-all">{url}</span>
          </div>

          {/* Download CTA */}
          <button
            onClick={handleDownload}
            className="w-full max-w-[280px] flex items-center justify-center gap-2 py-3 bg-[#C89445] hover:bg-[#d6a254] text-[#0E302A] font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer"
          >
            <Download className="w-5 h-5" />
            Download PNG (High Res)
          </button>
        </div>
      </div>
    </div>
  );
}
