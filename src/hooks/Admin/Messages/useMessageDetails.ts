// // src/hooks/Admin/Messages/useMessageDetails.ts
// import { useState, useEffect } from 'react';
// import { getMessageById, updateMessageStatus, type Message } from '../../../service/messages/messages.service';
// import { toast } from 'react-hot-toast';

// export const useMessageDetails = (messageId: string | undefined) => {
//   const [message, setMessage] = useState<Message | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchMessageDetails = async () => {
//       if (!messageId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         const data = await getMessageById(messageId);
        
//         if (data) {
//           setMessage(data);
//           // Automatically mark as seen when viewing
//           if (data.status === 'new') {
//             await updateMessageStatus(messageId, 'seen');
//           }
//         } else {
//           setError('Message not found');
//           toast.error('Message not found');
//         }
//       } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : 'Failed to fetch message details';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessageDetails();
//   }, [messageId]);

//   return {
//     message,
//     loading,
//     error
//   };
// };