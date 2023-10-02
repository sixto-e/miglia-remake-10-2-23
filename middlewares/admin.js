
const veryAdmin = (req, res, next) => {
    // SI
    req.session.rol == 1 && req.session.user ? (next())
    // SI NO
    : res.end(`
      <html>
        <head>
        <meta charset="utf-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
            }
            .container {
              display:flex;
              justify-content:center;
              align-items:center;
              flex-direction:column;
              width: 60vw;
              height: 50%;
              margin: 200px auto;
              padding: 30px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .error-message {
              color: #ff0000;
              font-size: 30px;
              text-align: center;
              margin-top: 20px;
            }
            .btn {
              display: block;
              width: 40%;
              padding: 10px;
              background-color: #007bff;
              color: #fff;
              text-align: center;
              text-decoration: none;
              border: none;
              border-radius: 3px;
              font-size: 40px;
              cursor: pointer;
            }
            .btn:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p class="error-message">
              ¡Oops! No sos administrador o no iniciaste sesión.
            </p>
            <a class="btn" href="/login">Inicia sesión</a>
          </div>
        </body>
      </html>
    `);
  };
  
  module.exports = { veryAdmin };
  

  