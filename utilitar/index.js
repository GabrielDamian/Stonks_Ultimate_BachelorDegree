const axios = require('axios');
const { exec } = require('child_process');

async function startDockerContainers(action) {
    console.log("start docker entry")   
    try {
        const response = await axios.get('http://localhost:3005/node');
        const { data } = response;
        console.log("Data:",data)
        
        let nodes = data.nodes;
        if(nodes == undefined) return

        for (const node of nodes) {
            let command;
            let containerId = node.containerId

            if (action === 'start') {
                command = `docker start ${containerId}`;
            } else if (action === 'stop') {
                command = `docker stop ${containerId}`;
            } else {
                throw new Error(`Acțiunea "${containerId}" nu este recunoscută.`);
            }

            exec(command, (error, stdout, stderr) => {
                if (error) {
                console.error(`Eroare la ${action} petntru ID-ul ${containerId}: ${error.message}`);
                } else {
                console.log(`Containerul cu ID-ul ${containerId}, actiune ${action} succes.`);
                }
            });
        }
    } catch (error) {
        console.error('Eroare la efectuarea request-ului GET:', error.message);
    }
}
const action = process.argv[2];
console.log("action argv:",action)
// Apelăm funcția pentru a porni containerele Docker
startDockerContainers(action);
