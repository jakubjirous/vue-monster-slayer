function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRounds: 0,
            winner: null,
            logMessages: [],
            logMessagesByRounds: [],
        }
    },
    methods: {
        attackMonster() {
            this.incrementRound();
            const attackDamage = getRandomValue(5, 12);
            this.monsterHealth -= attackDamage;
            this.addLogMessage('player', 'attack');
            this.attackPlayer();
        },
        attackPlayer() {
            const attackDamage = getRandomValue(8, 15);
            this.playerHealth -= attackDamage;
            this.addLogMessage('monster', 'attack', attackDamage, this.currentRounds);
        },
        // available every three rounds
        specialAttackMonster() {
            this.incrementRound();
            const attackDamage = getRandomValue(10, 25);
            this.monsterHealth -= attackDamage;
            this.addLogMessage('player', 'attack', attackDamage);
            this.attackPlayer();
        },
        healPlayer() {
            this.incrementRound();
            const healValue = getRandomValue(8, 20);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }
            this.addLogMessage('player', 'heal', healValue);
            this.attackPlayer();
        },
        surrenderPlayer() {
            this.incrementRound();
            this.playerHealth = 0;
            this.addLogMessage('player', 'surrender', 0, this.currentRounds);
            this.winner = 'monster';
        },
        incrementRound() {
            this.currentRounds++
        },
        startNewGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRounds = 0;
            this.winner = null;
            this.logMessages = [];
        },
        addLogMessage(who, what, value, round) {
            // push but adding item to the beginning of the array
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value,
                actionRound: round
            });
        }
    },
    computed: {
        renderPlayerStyles() {
            if (this.playerHealth < 0) {
                return {
                    width: '0%'
                };
            } else {
                return {
                    width: this.playerHealth + '%'
                };
            }
        },
        renderMonsterStyles() {
            if (this.monsterHealth < 0) {
                return {
                    width: '0%'
                };
            } else {
                return {
                    width: this.monsterHealth + '%'
                };
            }
        },
        mayUseSpecialAttack() {
            return this.currentRounds % 3 !== 0;
        },
        mayUsePlayerHeal() {
            return this.playerHealth === 100;
        }
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                // A draw
                this.winner = 'draw';
            } else if (value < 0) {
                // Player lost
                this.winner = 'monster';
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                // A draw
                this.winner = 'draw';
            } else if (value < 0) {
                // Monster lost
                this.winner = 'player';
            }
        }
    }
});

app.mount('#game');
