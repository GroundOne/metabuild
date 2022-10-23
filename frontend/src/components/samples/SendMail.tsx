import React, { useState } from 'react';

export default function SendMail() {
    const [message, setMessage] = useState('');
    const sendMail = async () => {
        try {
            setMessage('Sending test mail');
            // const api = process.env.NEXT_PUBLIC_API_URL + '/send-email';
            const api = '/api/send-email';

            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: 'frangiskos@gmail.com',
                    template: 'testMail',
                }),
            });

            const { success, message } = await response.json();
            if (success) {
                setMessage('Mail sent');
            } else {
                setMessage(message);
            }
        } catch (error: any) {
            setMessage(error.message);
        }
    };
    return (
        <div>
            <button onClick={sendMail}>Send Email</button>
            {message}
        </div>
    );
}
