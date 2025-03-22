document.addEventListener('DOMContentLoaded', () => {
    const testInput = document.getElementById('test-input');
    const testButton = document.getElementById('test-button');

    testButton.addEventListener('click', () => {
        console.log("Button clicked! Input value:", testInput.value);
        alert("Button clicked! Input value: " + testInput.value);
    });

    testInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            console.log("Enter key pressed! Input value:", testInput.value);
            alert("Enter key pressed! Input Value: "+ testInput.value)
            event.preventDefault();
        }
    });
});