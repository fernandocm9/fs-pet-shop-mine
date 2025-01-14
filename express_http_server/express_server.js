const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const dataPath = path.join(__dirname, 'pets.json')
const PORT = 8000


app.get('/pets', function(req, res){
    fs.readFile(dataPath, 'utf8', function(err, data){
        if(err){
            fiveHundErr(err, req, res, 'Not Found')
        }
        res.setHeader('Content-Type', 'application/json')
        res.status(200)
        res.send(data)
    })
})

app.get('/pets/:id', function(req, res){
    let num = req.params.id
    fs.readFile(dataPath, 'utf8', function(err, data){
        let pets = JSON.parse(data)
        if(err){
            fiveHundErr(err, req, res, "Pet is not in the list")
        }
        if(num < pets.length && num >= 0 && isNaN(num) === false){
        let result = JSON.stringify(pets[num])
        res.setHeader('Content-Type', 'application/json')
        res.status(200)
        res.send(result)
        } else {
            fiveHundErr(err, req, res, "Pet is not in the list")
        }
        
    })
})


app.post('/pets/:age/:kind/:name', function(req, res){
    let addObj = {
    age: parseInt(req.params.age),
    kind: req.params.kind,
    name: req.params.name
    }
    fs.readFile(dataPath, 'utf8', function(err, data){
        let pets = JSON.parse(data)
        pets.push(addObj)
        let result = JSON.stringify(addObj)
        fs.writeFile(dataPath, result, function(err){
            if(err){
                fiveHundErr(err, req, res, "Something was wrong with your body input")
            } else {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.send(result)
            }
        })
    })
})

app.use(express.json())

app.post('/pets', function(req, res){
    fs.readFile(dataPath, 'utf8', function(err, data){
        if(err){
            fiveHundErr(err, req, res, "Something was wrong with your body input")
        }
        let pets = JSON.parse(data)
        pets.push(req.body)
        let jsonStr = JSON.stringify(pets)
        fs.writeFile(dataPath, jsonStr, function(err){
            if(err){
                console.error(err)
            } else {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.send(jsonStr)
            }
        })
    })
})

app.use(function(req, res){
    res.setHeader('Content-Type', 'text/plain')
    res.statusCode = 404
    res.json({
        "message": "Page does not exist"
    })
})

app.listen(PORT, function(req, res){
    console.log(`Listening on port: ${PORT}`)
})

function fiveHundErr(err, req, res, str){
    res.setHeader('Content-Type', 'text/plain')
    res.sendStatus(500)
    res.json({"message": str})
}
