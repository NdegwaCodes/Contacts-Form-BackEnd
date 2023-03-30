const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel")
//@desc Get all contacts
//@route GET /api/contacts
//@access private

const getContacts = asyncHandler(async (req,res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

//@desc Get New contact
//@route POST /api/contacts
//@access private

const createContact = asyncHandler(async (req,res) => {
    console.log("The request body is:", req.body);
    const {name,email,phone} = req.body;
    if (!name|| !email || !phone) {
    res.status(400);
    throw new Error("All Fields are Mandatory!");
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id,
    });
    res.status(201).json(contact);
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access private

const getContact = asyncHandler( async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
     res.status(404);
     throw new Error("Contact not found") 
    }
    res.status(200).json(contact);
});

//@desc Update all contacts
//@route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler( async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
     res.status(404);
     throw new Error("Contact not found"); 
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("Don't Have Permission To Update Other User Contacts");
    }
    const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(200).json(updatedContact);
});

//@desc Delete all contacts
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler( async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
     res.status(404);
     throw new Error("Contact not found"); 
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("Don't Have Permission To Delete Other User Contacts");
    }
    await Contact.deleteOne({user_id: req.params.id});
    res.status(200).json(contact);
});

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
};