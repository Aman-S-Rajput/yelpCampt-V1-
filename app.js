const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const { title } = require('process');
const methodOverride = require('method-override')
const campground = require('./models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp')
  .then(() => {
    console.log("MongoDB database connected");
  })
  .catch(err => {
    console.error("Connection error in mongoose:", err);
  });


const app = express();

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))

app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

app.get('/',(req,res)=>
{
    res.render('home');
})

app.get('/campground',async(req,res) =>
{
    const campgrounds = await Campground.find({});
    res.render('campground/campground',{campgrounds});
})

app.post('/campground',async(req,res)=>
{
    const newCamp = new Campground(req.body.camp);
    await newCamp.save();
    res.redirect(`campground/${newCamp._id}`);  
})

app.get('/campground/new',(req,res)=>
{
    res.render('campground/new');
})

app.get('/campground/:id/edit',async(req,res)=>
{   
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campground/edit',{camp});
})

app.get('/campground/:id',async(req,res)=>
{   
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campground/show',{camp});
})

app.put('/campground/:id', async(req, res)=>
{
    const{id} = req.params;
    const cmp = await Campground.findByIdAndUpdate(id,{...req.body.camp});
    res.redirect(`/campground/${cmp._id}`)
})

app.delete('/campground/:id',async(req,res)=>
{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
})

app.listen(3000,()=>
{
    console.log("Listening on Server 3000");
})
