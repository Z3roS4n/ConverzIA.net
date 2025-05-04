const button = document.getElementById("start");

button.addEventListener("click", async () => {
  const ws = new WebSocket("ws://localhost:3000/ws");  // Assicurati che l'endpoint sia corretto

  // Quando la connessione WebSocket è stabilita
  ws.onopen = () => {
    console.log("✅ Connessione WebSocket stabilita");

    // Invia un messaggio al server per testare la comunicazione
    ws.send("Ciao server! Test di connessione");
  };

  // Quando riceviamo un messaggio dal server
  ws.onmessage = (event) => {
    console.log("📬 Risposta dal server:", event.data);
    
    // Puoi aggiungere qui logica per riprodurre l'audio o visualizzare altre informazioni
  };

  // Gestione errori WebSocket
  ws.onerror = (error) => {
    console.error("❌ Errore WebSocket:", error);
  };
});
