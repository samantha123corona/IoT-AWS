import React, { useEffect, useState } from 'react';
import socket from '../services/socket';

const SocketTester = () => {
  const [status, setStatus] = useState('Desconectado');
  const [socketId, setSocketId] = useState('');
  const [messages, setMessages] = useState([]);
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    console.log('🔧 Inicializando SocketTester...');

    const onConnect = () => {
      console.log('✅ Socket conectado en tester');
      setStatus('Conectado');
      setSocketId(socket.id);
      addMessage('✅ Conectado al servidor - ID: ' + socket.id);
    };

    const onDisconnect = (reason) => {
      console.log('❌ Socket desconectado:', reason);
      setStatus('Desconectado');
      setSocketId('');
      addMessage(`❌ Desconectado - Razón: ${reason}`);
    };

    const onConnectError = (error) => {
      console.error('💥 Error de conexión:', error);
      addMessage(`💥 Error: ${error.message}`);
    };

    const onMessage = (data) => {
      console.log('📨 Mensaje del servidor:', data);
      addMessage(`📨 Mensaje: ${JSON.stringify(data)}`);
    };

    const onPong = (data) => {
      console.log('🏓 Pong recibido:', data);
      addMessage(`🏓 Pong: ${JSON.stringify(data)}`);
    };

    const onTestResponse = (data) => {
      console.log('🧪 Test response:', data);
      addMessage(`🧪 Test: ${JSON.stringify(data)}`);
    };

    // Registrar todos los eventos
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('message', onMessage);
    socket.on('pong', onPong);
    socket.on('test_response', onTestResponse);

    // Conectar manualmente
    console.log('🔌 Intentando conectar socket...');
    socket.connect();

    return () => {
      console.log('🧹 Limpiando SocketTester');
      // Remover todos los listeners
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('message', onMessage);
      socket.off('pong', onPong);
      socket.off('test_response', onTestResponse);
    };
  }, []);

  const addMessage = (msg) => {
    setMessages(prev => [msg, ...prev].slice(0, 15));
  };

  const sendPing = () => {
    const payload = { 
      message: testMessage || 'Hello from client', 
      timestamp: Date.now() 
    };
    console.log('📤 Enviando ping:', payload);
    addMessage('📤 Enviando ping...');
    socket.emit('ping', payload);
  };

  const sendTest = () => {
    const payload = { 
      test: true, 
      message: testMessage || 'Test message',
      timestamp: Date.now(),
      from: 'react-client'
    };
    console.log('📤 Enviando test:', payload);
    addMessage('📤 Enviando test event...');
    socket.emit('test_event', payload);
  };

  const disconnect = () => {
    console.log('🔌 Desconectando manualmente');
    socket.disconnect();
  };

  const connect = () => {
    console.log('🔗 Conectando manualmente');
    socket.connect();
  };

  const clearMessages = () => {
    setMessages([]);
  };

  // Agrega estos botones adicionales en SocketTester.jsx
const testNgrok = () => {
  const payload = { 
    test: 'ngrok',
    message: testMessage || 'Testing ngrok connection',
    timestamp: Date.now(),
    client: 'react-app'
  };
  console.log('🌐 Enviando test ngrok:', payload);
  addMessage('🌐 Enviando test ngrok...');
  socket.emit('test_ngrok', payload);
};


  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>🧪 Probador de WebSockets</h5>
        <div>
          <span className={`badge ${status === 'Conectado' ? 'bg-success' : 'bg-warning'}`}>
            {status}
          </span>
          {socketId && (
            <span className="badge bg-info ms-2">ID: {socketId.substring(0, 8)}...</span>
          )}
        </div>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Mensaje de prueba:</label>
          <input
            type="text"
            className="form-control"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Escribe un mensaje para probar..."
          />
        </div>
        
        <div className="btn-group mb-3 flex-wrap">
          <button className="btn btn-success" onClick={connect}>
            🔗 Conectar
          </button>
          <button className="btn btn-warning" onClick={disconnect}>
            🔌 Desconectar
          </button>
          <button className="btn btn-primary" onClick={sendPing}>
            🏓 Enviar Ping
          </button>
          <button className="btn btn-info" onClick={sendTest}>
            🧪 Enviar Test
          </button>
          <button className="btn btn-secondary" onClick={clearMessages}>
            🧹 Limpiar
          </button>
        </div>

        <div>
          <h6>Log de mensajes:</h6>
          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto',
            backgroundColor: '#f8f9fa',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '0.85rem'
          }}>
            {messages.length === 0 ? (
              <div className="text-muted">No hay mensajes aún...</div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="border-bottom py-1">
                  <code>{msg}</code>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
// En el return, agrega este botón:
<button className="btn btn-warning" onClick={testNgrok}>
  🌐 Test Ngrok
</button>
    </div>
    
  );
};

export default SocketTester;