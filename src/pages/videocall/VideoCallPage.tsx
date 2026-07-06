import React, { useState } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Phone, ScreenShare } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const VideoCallPage: React.FC = () => {
  const [inCall, setInCall] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  const startCall = () => setInCall(true);
  const endCall = () => {
    setInCall(false);
    setVideoOn(true);
    setAudioOn(true);
    setScreenSharing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Video Call</h1>
        <p className="text-gray-600">Connect face-to-face with investors and entrepreneurs</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            {inCall ? 'Call in Progress' : 'Start a New Call'}
          </h2>
        </CardHeader>
        <CardBody>
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
            {inCall && videoOn ? (
              <div className="text-white text-center">
                <div className="w-24 h-24 bg-highlight-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Video size={40} />
                </div>
                <p className="text-sm text-gray-300">Camera feed would appear here</p>
              </div>
            ) : inCall && !videoOn ? (
              <div className="text-white text-center">
                <VideoOff size={48} className="mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-400">Camera is off</p>
              </div>
            ) : (
              <div className="text-white text-center">
                <Phone size={48} className="mx-auto mb-3 text-gray-500" />
                <p className="text-sm text-gray-400">No active call</p>
              </div>
            )}

            {screenSharing && (
              <div className="absolute top-3 right-3 bg-highlight-500 text-white text-xs px-3 py-1 rounded-full">
                Screen Sharing
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            {!inCall ? (
              <Button
                onClick={startCall}
                variant="highlight"
                leftIcon={<Phone size={18} />}
              >
                Start Call
              </Button>
            ) : (
              <>
                <Button
                  variant={audioOn ? 'outline' : 'error'}
                  onClick={() => setAudioOn(!audioOn)}
                  leftIcon={audioOn ? <Mic size={18} /> : <MicOff size={18} />}
                >
                  {audioOn ? 'Mute' : 'Unmute'}
                </Button>

                <Button
                  variant={videoOn ? 'outline' : 'error'}
                  onClick={() => setVideoOn(!videoOn)}
                  leftIcon={videoOn ? <Video size={18} /> : <VideoOff size={18} />}
                >
                  {videoOn ? 'Stop Video' : 'Start Video'}
                </Button>

                <Button
                  variant={screenSharing ? 'highlight' : 'outline'}
                  onClick={() => setScreenSharing(!screenSharing)}
                  leftIcon={<ScreenShare size={18} />}
                >
                  {screenSharing ? 'Stop Sharing' : 'Share Screen'}
                </Button>

                <Button
                  variant="error"
                  onClick={endCall}
                  leftIcon={<PhoneOff size={18} />}
                >
                  End Call
                </Button>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};