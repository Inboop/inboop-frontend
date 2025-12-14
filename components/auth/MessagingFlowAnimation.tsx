import { Instagram, MessageCircle, Facebook } from 'lucide-react';

export function MessagingFlowAnimation() {
  return (
    <>
      <style>{`
        @keyframes floatMessage1 {
          0% {
            opacity: 0;
            transform: translateX(0) translateY(0) scale(0.8);
          }
          20% {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1);
          }
          80% {
            opacity: 1;
            transform: translateX(220px) translateY(90px) scale(0.9);
          }
          100% {
            opacity: 0;
            transform: translateX(250px) translateY(90px) scale(0.7);
          }
        }

        @keyframes floatMessage2 {
          0% {
            opacity: 0;
            transform: translateX(0) translateY(0) scale(0.8);
          }
          20% {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1);
          }
          80% {
            opacity: 1;
            transform: translateX(220px) translateY(0px) scale(0.9);
          }
          100% {
            opacity: 0;
            transform: translateX(250px) translateY(0px) scale(0.7);
          }
        }

        @keyframes floatMessage3 {
          0% {
            opacity: 0;
            transform: translateX(0) translateY(0) scale(0.8);
          }
          20% {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1);
          }
          80% {
            opacity: 1;
            transform: translateX(220px) translateY(-90px) scale(0.9);
          }
          100% {
            opacity: 0;
            transform: translateX(250px) translateY(-90px) scale(0.7);
          }
        }

        @keyframes pulseInbox {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0);
          }
        }

        /* Inbox notification stacking - like iPhone notifications
           Each notification: enters at top → moves to middle → moves to bottom → exits
        */
        @keyframes notificationFlow {
          /* Enter from above at top position */
          0% {
            opacity: 0;
            transform: translateY(-24px);
          }
          /* Visible at top */
          8% {
            opacity: 1;
            transform: translateY(0);
          }
          /* Stay at top */
          30% {
            opacity: 1;
            transform: translateY(0);
          }
          /* Move to middle */
          38% {
            opacity: 1;
            transform: translateY(20px);
          }
          /* Stay at middle */
          60% {
            opacity: 1;
            transform: translateY(20px);
          }
          /* Move to bottom */
          68% {
            opacity: 1;
            transform: translateY(40px);
          }
          /* Stay at bottom, start fading */
          90% {
            opacity: 0.5;
            transform: translateY(40px);
          }
          /* Exit below */
          100% {
            opacity: 0;
            transform: translateY(56px);
          }
        }

        .message-bubble-1 {
          animation: floatMessage1 5s ease-in-out infinite;
        }

        .message-bubble-2 {
          animation: floatMessage2 5s ease-in-out infinite 1.7s;
        }

        .message-bubble-3 {
          animation: floatMessage3 5s ease-in-out infinite 3.4s;
        }

        .inbox-pulse {
          animation: pulseInbox 5s ease-in-out infinite;
        }

        .inbox-notif {
          animation: notificationFlow 7.5s ease-in-out infinite;
        }

        .inbox-notif-1 {
          animation-delay: 0s;
        }

        .inbox-notif-2 {
          animation-delay: 2.5s;
        }

        .inbox-notif-3 {
          animation-delay: 5s;
        }
      `}</style>

      <div className="relative h-40 w-full max-w-md">
        {/* Platform Icons - Left Side */}
        <div className="absolute left-0 top-0 flex flex-col gap-8">
          {/* Instagram */}
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Instagram className="w-7 h-7 text-white" />
            </div>
            {/* Message bubble from Instagram */}
            <div className="absolute left-16 top-2 message-bubble-1">
              <div className="w-16 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30" />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            {/* Message bubble from WhatsApp */}
            <div className="absolute left-16 top-2 message-bubble-2">
              <div className="w-16 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30" />
            </div>
          </div>

          {/* Facebook */}
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Facebook className="w-7 h-7 text-white" />
            </div>
            {/* Message bubble from Facebook */}
            <div className="absolute left-16 top-2 message-bubble-3">
              <div className="w-16 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30" />
            </div>
          </div>
        </div>

        {/* Unified Inbox - Right Side - Centered among all three platforms */}
        <div className="absolute right-0 top-[118px] -translate-y-1/2">
          <div className="w-28 h-36 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 inbox-pulse overflow-hidden">
            {/* Notification stack - all start at top, flow down, exit at bottom */}
            <div className="absolute top-[46px] left-0 right-0 flex justify-center">
              <div className="w-16 h-3 rounded bg-white/40 inbox-notif inbox-notif-1" />
            </div>
            <div className="absolute top-[46px] left-0 right-0 flex justify-center">
              <div className="w-16 h-3 rounded bg-white/40 inbox-notif inbox-notif-2" />
            </div>
            <div className="absolute top-[46px] left-0 right-0 flex justify-center">
              <div className="w-16 h-3 rounded bg-white/40 inbox-notif inbox-notif-3" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}