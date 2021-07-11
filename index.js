// Importieren der SHA256 Bibliothek um diese später nutzen zu können
const SHA256 = require('crypto-js/sha256');

// Erstellen der Klasse CryptoBlock 
// die für das Verwalten eines Blockes genutzt wird
class CryptoBlock{
    constructor(index, zeitstempel, data, vorherigerHash=" "){
     this.index = index; // Blocknummer in dem Array
     this.zeitstempel = zeitstempel; // Zeistempel des erstellens
     this.data = data; // Gespeicherte Daten z.B Transationsnummer, Summe
     this.vorherigerHash = vorherigerHash;
     this.hash = this.generiereHash();     
    }

    // Generiert den SHA256 verschlüsselten Hash
    generiereHash(){
        // Rückgabetyp = String
        return SHA256(
            this.index + // Index des neuen Blockes
             this.vorherigerHash + 
             this.zeitstempel +
             //Umwandlung der Data von einem String zu einem JSON Objekt
             JSON.stringify(this.data)).toString();
    }   
}

// Erstellen der Klasse CryptoBlockchain
// die für das Verwalten der Blockchain genutzt wird
class CryptoBlockchain{
    // Beim erstmaligen aufrufen der Klasse und des damit verbunden Constructors,
    // wird der Startblock generiert
    constructor(){
        this.blockchain = [this.startBlock()];     
    }

    //Generieren des Startblocks mit vordefinierten Daten
    startBlock(){
        return new CryptoBlock(0, "01/01/2021", "Erster Block in der Kette", "0");
    }

    // Getter um den neusten Block sich ausgeben zu lassen oder um den Hash auszulesen
    bekommeNeuestenBlock(){
        return this.blockchain[this.blockchain.length - 1];
    }

    // Hinzufügen eines neuen Blocks
    neuenBlockHinzufuegen(neuerBlock){
        // Speichern des vorhergehenden Hash-Wertes des Blocks
        neuerBlock.vorherigerHash = this.bekommeNeuestenBlock().hash;
        // Erstellen des Hash's des neuen Blocks
        neuerBlock.hash = neuerBlock.generiereHash();
        // Speichern des neuen Blocks
        this.blockchain.push(neuerBlock);
    }
}

console.log("Willkommen bei GigoloCoin ihr Rumänisch-Italienischer Crypto Experte des Vertrauens");
let gigoloCoin = new CryptoBlockchain();
gigoloCoin.neuenBlockHinzufuegen(new CryptoBlock(1, "01/06/2020", {sender: "Giorgio Dodaro", recipient: "Luca Hiemer", quantity: 50}));
gigoloCoin.neuenBlockHinzufuegen(new CryptoBlock(2, "01/07/2020", {sender: "Luca Hiemer", recipient: "Jadranko Jurkovic", quantity: 100}) );
console.log(JSON.stringify(gigoloCoin, null, 4));