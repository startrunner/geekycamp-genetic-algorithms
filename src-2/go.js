const States = {
    EVOLVING: 0,
    MASTERRACE: 1,
    INACTIVE: 2
}

const logArea = document.querySelector('#area-log');
const cancelButton = document.querySelector('#btn-cancel');
const genesisButton = document.querySelector('#btn-genesis');
const autoScrollCheck = document.querySelector('#check-autoScroll');
let cancelling = false;

function setState(state){
    if(state == States.EVOLVING){
        logArea.innerHTML = "";
        genesisButton.disabled = true;
        cancelButton.disabled = false;
    }else{
        genesisButton.disabled = false;
        cancelButton.disabled = true;
    }
}

function log(text){
    logArea.innerHTML+=text+'\n';
    if(autoScrollCheck.checked){
        logArea.scrollTop = logArea.scrollHeight;
    }
}

function getRandomCharacter(alphabet){
    return alphabet[getRandomInt(0, alphabet.length-1)];
}

function makeRandomString(alphabet, length){
    let result = "";
    for(let i=0;i<length;i++)result+=getRandomCharacter(alphabet);
    return result;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeRandomGeneration(alphabet, individualCount, length){
    let generation = [];
    for(let i=0;i<individualCount;i++){
        generation.push(makeRandomString(alphabet, length));
    }
    return generation;
}

function go(){
    const alphabet = document.querySelector("#input-alphabet").value;
    const individualsInGeneration = document.querySelector('#input-individualsInGeneration').value;
    const mutationMultiplier = document.querySelector('#input-mutationMultiplier').value;
    const targetString = document.querySelector('#input-targetString').value;
    const elitism = document.querySelector('#input-elitism').value;
    const stringLength = targetString.length;
    
    if(elitism * (elitism-1) /2 < individualsInGeneration){
        log("Elitism too small for this count of individuals in generation");
        return;
    }

    setState(States.EVOLVING);
    
    const firstGeneration = makeRandomGeneration(alphabet, individualsInGeneration, stringLength);
    setTimeout(() => {
        cycle(0, firstGeneration, alphabet, targetString, mutationMultiplier, elitism);
    }, 1);
}

function logGeneration(id, generation){
    log(`Generation #${id}`);
    log(generation);
}

function calculateUnfitness(individual, targetString){
    let unfitness = 0;
    let chars = {};

    for(let i=0;i<individual.length;i++)chars[individual[i]]=true;

    for(let i=0;i<targetString.length;i++){
        if(!chars[targetString[i]])unfitness++;
        else if(individual[i]==targetString[i])unfitness-=100;
    }
    return unfitness;
}

function gradeGeneration(generation, targetString){
    let gradedGeneration = [];
    generation.forEach(individual => {
        gradedGeneration.push({
            individual: individual,
            unfitness: calculateUnfitness(individual, targetString)
        });
    });
    gradedGeneration.sort((x, y)=>(x.unfitness-y.unfitness));
    return gradedGeneration;
}

function mate(x, y, alphabet, mutationMultiplier){
    const length = Math.min(x.length, y.length);
    let child = "";
    for(let i=0;i<length;i++){
        if(Math.random() < mutationMultiplier){
            child+=getRandomCharacter(alphabet);
        }
        else if(getRandomInt(0, 1))child+=x[i];
        else child+=y[i];
    }
    return child;
}

function mateElitists(elitists, alphabet, individualsInGeneration, mutationMultiplier){
    let allPairs = [];
    let generation = [];

    let elististCount = elitists.length;
    for(let i=0;i<elististCount;i++){
        for(let j=i+1;j<elististCount;j++){
            allPairs.push({i: i+0, j: j+0});
        }
    }


    for(let i=0;i<individualsInGeneration;i++){
        let index = getRandomInt(0, allPairs.length-1);
        let swap = allPairs[index];
        allPairs[index] = allPairs[allPairs.length-1];
        allPairs[allPairs.length-1]=swap;
        allPairs.pop();
        generation.push(mate(
            elitists[swap.i].individual,
            elitists[swap.j].individual,
            alphabet,
            mutationMultiplier
        ))
    }

    return generation;
}

function checkMatch(generation, targetString){
    console.log("checking " + targetString);
    for(let i=0;i<generation.length;i++){
        if(generation[i]==targetString)return true;
    }
    return false;
}

function cycle(id, previousGeneration, alphabet, targetString, mutationMultiplier, elitism){
    const individualsInGeneration = previousGeneration.length;
    const stringLength = previousGeneration[0].length;
    logGeneration(id, previousGeneration);
    if(checkMatch(previousGeneration, targetString)){
        log(`Target string '${targetString}' found in generation #${id}`);
        setState(States.MASTERRACE);
        return;
    }
    if(cancelling){
        setState(States.INACTIVE);
        log(`Cancelled before generation #${id}`);
        cancelling = false;
        return;
    }

    let elitists = gradeGeneration(previousGeneration, targetString);
    while(elitists.length > elitism)elitists.pop();

    const nextGeneration = mateElitists(elitists, alphabet, individualsInGeneration, mutationMultiplier);


    setTimeout(() => {
        cycle(id+1, nextGeneration, alphabet, targetString, mutationMultiplier, elitism);
    }, 2000);
}

