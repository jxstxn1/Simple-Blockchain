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
     // Stellt die Schwierigkeit des zu berechnenden Hash Wertes da
     this.nonce = 0;
    }

    // Generiert den SHA256 verschlüsselten Hash
    generiereHash(){
        // Rückgabetyp = String
        return SHA256(
            this.index + // Index des neuen Blockes
             this.vorherigerHash + 
             this.zeitstempel +
             //Umwandlung der Data von einem String zu einem JSON Objekt
             JSON.stringify(this.data) + this.nonce).toString();
    }
    
    // Bestätigt den berechneten Hash Wert
    // und speichert eine Nonce um bei einem
    // neu Hashen die gleiche schwierigkeit
    // wieder nutzen zu können 
    proofOfWork(schwierigkeit){
        while(this.hash.substring(0, schwierigkeit) !==Array(schwierigkeit + 1).join("0")){
            this.nonce++;
            this.hash = this.generiereHash();
        }        
    }
}

// Erstellen der Klasse CryptoBlockchain
// die für das Verwalten der Blockchain genutzt wird
class CryptoBlockchain{
    // Beim erstmaligen aufrufen der Klasse und des damit verbunden Constructors,
    // wird der Startblock generiert
    constructor(){
        this.blockchain = [this.startBlock()];    
        this.schwierigkeit = 4;
        this.erhoeheSchwierigkeitStart = 2; 
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
        neuerBlock.proofOfWork(this.schwierigkeit); 
        // Speichern des neuen Blocks
        this.blockchain.push(neuerBlock);
        // überprüfen ob schwierigkeit erhöht werden muss
        this.erhoeheSchwierigkeit();
        // überprüft ob die Blockchain noch gültig ist
        this.ueberpruefeBlockChainGueltigkeit();
    }


    // Überprüft ob die Blockchain noch gültig ist,
    // verhindert durch stopen des Systems eine
    // kompromittierung der Blockchain
    ueberpruefeBlockChainGueltigkeit() {
        for (let i = 1; i < this.blockchain.length; i++) {
          const aktuellerBlock = this.blockchain[i];
          const vorherigerBlock = this.blockchain[i - 1];
          if (aktuellerBlock.hash !== aktuellerBlock.generiereHash()) {
            process.exit(1);
          }
          if (aktuellerBlock.vorherigerHash !== vorherigerBlock.hash) return process.exit(1);
        }
        return true;
      }

      // erhöht die Schwierigkeit der Blockchain dynamisch
      erhoeheSchwierigkeit() {
          var blockChainGroesse = this.blockchain.length;
          if(blockChainGroesse == this.erhoeheSchwierigkeitStart) {
              this.erhoeheSchwierigkeitStart++;
              this.schwierigkeit++;
          }
      }
}


console.log("Willkommen bei GigoloCoin ihr Rumänisch-Italienischer Crypto Experte des Vertrauens");
let gigoloCoin = new CryptoBlockchain();
gigoloCoin.neuenBlockHinzufuegen(new CryptoBlock(1, "01/06/2021", {Sender: "Giorgio Dodaro", Empfaenger: "Luca Hiemer", Menge: 50}));
gigoloCoin.neuenBlockHinzufuegen(new CryptoBlock(2, "02/07/2021", {Sender: "Luca Hiemer", Empfaenger: "Jadranko Jurkovic", Menge: 100}) );
gigoloCoin.neuenBlockHinzufuegen(new CryptoBlock(3, "03/07/2021", {Sender: "Georg Piel", Empfaenger: "Luca Hiemer",  Menge: 3}) );
console.log(JSON.stringify(gigoloCoin, null, 4));
console.log("BlockChain Gültig: " + gigoloCoin.ueberpruefeBlockChainGueltigkeit());