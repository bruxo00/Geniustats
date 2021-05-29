module.exports = {
    clearConsole: () => {
        let lines = 30;

        try {
            lines = process.stdout.getWindowSize()[1];
        } catch (error) { }

        for (let i = 0; i < lines; i++) {
            console.log('\r\n');
        }
    },
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    getRandomIntBetween: (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
};