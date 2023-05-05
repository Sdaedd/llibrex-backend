const express = require('express')
const app = express()

//routes
app.get('/', (req, res) => {
    res.send('Hello LLIBREX API')
})

app.listen(3000, ()=> {
    console.log('Llibrex API app is running on port 3000')
})