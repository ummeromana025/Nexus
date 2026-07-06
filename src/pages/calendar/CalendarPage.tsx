import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-theme.css';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface MeetingSlot {
  id: string;
  date: string;
  time: string;
  status: 'available' | 'pending' | 'confirmed';
}

export const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<MeetingSlot[]>([
    { id: '1', date: new Date().toDateString(), time: '10:00 AM', status: 'available' },
    { id: '2', date: new Date().toDateString(), time: '2:00 PM', status: 'confirmed' },
  ]);

  const addSlot = () => {
    const time = prompt('Enter time (e.g. 3:00 PM):');
    if (!time) return;
    const newSlot: MeetingSlot = {
      id: Date.now().toString(),
      date: selectedDate.toDateString(),
      time,
      status: 'available',
    };
    setSlots([...slots, newSlot]);
  };

  const updateStatus = (id: string, status: MeetingSlot['status']) => {
    setSlots(slots.map(slot => (slot.id === id ? { ...slot, status } : slot)));
  };

  const slotsForSelectedDate = slots.filter(
    slot => slot.date === selectedDate.toDateString()
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meeting Scheduler</h1>
        <p className="text-gray-600">Manage your availability and meeting requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Select a Date</h2>
          </CardHeader>
          <CardBody>
            <Calendar
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              className="w-full"
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Slots for {selectedDate.toDateString()}
              </h2>
              <Button onClick={addSlot} className="bg-highlight-500 hover:bg-highlight-600 border-highlight-500">Add Slot</Button>
            </div>
          </CardHeader>
          <CardBody>
            {slotsForSelectedDate.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No slots for this date</p>
            ) : (
              <div className="space-y-3">
                {slotsForSelectedDate.map(slot => (
                  <div
                    key={slot.id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{slot.time}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          slot.status === 'confirmed'
                            ? 'bg-success-100 text-success-700'
                            : slot.status === 'pending'
                            ? 'bg-warning-100 text-warning-700'
                            : 'bg-highlight-100 text-highlight-700'
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {slot.status === 'available' && (
                        <Button
                          variant="outline"
                          onClick={() => updateStatus(slot.id, 'pending')}
                        >
                          Request
                        </Button>
                      )}
                      {slot.status === 'pending' && (
                        <>
                          <Button onClick={() => updateStatus(slot.id, 'confirmed')}>
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => updateStatus(slot.id, 'available')}
                          >
                            Decline
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};