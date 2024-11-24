const START_BYTE = '80';
const TRANSMIT_BYTE = '81';
const RECEIVE_BYTE = '82';
const END_BYTE = '8F';
const ERR_MSG = '-1,-1,-1';

/**
 * @brief send a signal to the node server
 * 
 * @param {string} msg command to send
 */
function send_signal(msg) {
    fetch('http://localhost:3000/send-signal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                msg
            })
        })
        .then(response => response.text())
        // .then(data => console.log(data))
        .catch(error => console.log('Error:', error));
}

/**
 * @brief read the latest signal from the node server
 * 
 * @returns {Promise<string>} the latest signal data
 */
function read_signal() {
    return fetch('http://localhost:3000/read-signal')
        .then(response => response.json())
        .then(data => data.data)
        .catch(error => {
            console.error('Error:', error);
            return ERR_MSG;
        });
}

