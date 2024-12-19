// backend
import express from 'express';
import path from 'path';
const app = express();
const port = 4000;

// log all request to the server
app.use((req, res, next) => {
  next();
  console.log(req.url);
});

// proxy willys
app.get('/api/*', async (req, res) => {
  res.json(await (await fetch(`https://www.willys.se${req.url.slice(4)}`)).json())
});

// Category tree: /api/leftMenu/categorytree 
// Category list: /api/c/kott-chark-och-fagel/palagg?size=30&page=0&sort=
// [topRated, name-asc,name-desc,price-asc,price-desc,compareprice-asc,compareprice-desc]
// Product info:  /api/axfood/rest/p/101290312_ST

// serve built application (dist folder)
const distFolder = path.join(import.meta.dirname, '..', 'dist');
app.use(express.static(distFolder));
app.get('*', (req, res) => {
  res.sendFile(path.join(distFolder, 'index.html'));
});


// start server
app.listen(port, () => console.log('Backend listening on port 4000'));