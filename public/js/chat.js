const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// 메시지 전송 함수
function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        displayMessage(message, 'user');
        userInput.value = '';

        // 서버로 메시지 전송
        sendToServer(message);
    }
}

// 메시지 화면에 표시 함수
function displayMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.innerText = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 서버로 메시지 전송 함수
async function sendToServer(userMessage) {
    try {
        const response = await fetch('https://b6f2-220-88-76-114.ngrok-free.app/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'ngrok-skip-browser-warning': true
            },
            body: JSON.stringify({ message: userMessage }),
        });
        if (!response.ok) {
            throw new Error("서버 응답 오류");
        }

        const data = await response.json();
        console.log(data)
        displayMessage(data.data, 'bot'); // 서버에서 받은 응답 메시지 표시
    } catch (error) {
        console.error("메시지 전송 실패:", error);
        displayMessage("서버와의 연결에 문제가 발생했습니다.", 'bot');
    }
}

// 엔터키로 메시지 전송
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
