const speakButton = document.getElementById('speak-button');
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const speechOutput = document.getElementById('speech-output');
const characterImg = document.getElementById('character-img');

let voices = [];
let talkingInterval;

// Fungsi untuk isi dropdown voice
function populateVoiceList() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '<option value="">Select Voice</option>';
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

// Panggil fungsi saat halaman siap
populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

speakButton.addEventListener('click', () => {
    const text = textInput.value.trim();
    const selectedVoiceIndex = voiceSelect.value;

    if (!text || selectedVoiceIndex === "") {
        alert('Please enter text and select a voice.');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[selectedVoiceIndex];

    // Update UI
    speechOutput.textContent = `"${text}" is being spoken...`;
    speakButton.disabled = true;
    speakButton.textContent = 'Speaking...';

    // Mulai animasi buka/tutup mulut
    let isOpen = false;
    talkingInterval = setInterval(() => {
        characterImg.src = isOpen ? "img/close.png" : "img/open.png";
        isOpen = !isOpen;
    }, 250);

    // Mulai bicara
    speechSynthesis.speak(utterance);

    // Setelah selesai bicara
    utterance.onend = () => {
        clearInterval(talkingInterval);
        characterImg.src = "img/close.png";
        speechOutput.textContent = 'Speech completed.';
        speakButton.disabled = false;
        speakButton.textContent = 'Speak';
    };
});
