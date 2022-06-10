
const express= require('express');
const bodyParser= require('body-parser');
// const date = require(__dirname+'/date.js')
const mongoose= require('mongoose')
const _=require('lodash')
const res = require('express/lib/response');
const app=express();


app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))
mongoose.connect('mongodb+srv://jibola2:test123@cluster0.cw4vt.mongodb.net/todolistDB')
mongoose.connection.once('open',function() {console.log('connected sucessfully');
    
})


const ItemSchema ={
name: String
}

 const Item = mongoose.model('Item',ItemSchema)


let defaultItems=[]

const listSchema={
    name:String,
    items:[ItemSchema]
}
const List= mongoose.model('List',listSchema)

app.get('/',function(req,res){
Item.find({},function(err,data){

    res.render('list',{listTitle:'Today',newListItems:data});

})
})




app.post('/',function(req,res){
 const   itemName = req.body.newItem
const listName=req.body.list;
const newItem = new Item({
name:itemName
})

if(listName==='Today'){

newItem.save();

res.redirect('/')}
else{

    List.findOne({name:listName},function(err,foundList){
        if(err){console.log(err);}
        else{foundList.items.push(newItem);
            foundList.save();}
res.redirect('/'+listName)
    })

}


})

app.post('/delete',function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName=req.body.list
  
if(listName==='Today'){Item.findByIdAndRemove(checkedItemId,function(err) {
    if(err){console.log(err)}
    else{res.redirect('/')}   
})
}else{
List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){

    if(!err){
        res.redirect('/'+listName)
    }
})
}

})

app.get('/:newList',function(req,res){

    const newListName= _.capitalize(req.params.newList);
    List.findOne({name:newListName},function(err,foundList){
if(!err){
    if(!foundList){
        //create list
        const list=new List({
            name:newListName,
            items:defaultItems
        })
        list.save()
        res.redirect('/'+newListName)
    }
    else{
        //show existing list
        res.render('list',{listTitle:newListName,newListItems:foundList.items})

    }
}
    })
    
})

app.get('/about',function(req,res){
    res.render('about')
})

app.listen( process.env.PORT ||3000,function(){
    console.log('server started on port 3000');
})