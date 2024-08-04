
# SkarX: Aap Ki Dukaan

### CSE 345/545: Foundation to Computer Security

An e-commerce platform designed for secure online transactions, offering a wide range of products such as electronics, mobile phones, gifts, grocery items, sports equipment, and more.

## Table of Contents
1. [Overview](#overview)
2. [Background Study](#background-study)
3. [Tools and Technologies](#tools-and-technologies)
4. [General Functionality Walkthrough](#general-functionality-walkthrough)
   - [Viewing and Searching System](#viewing-and-searching-system)
   - [Register System](#register-system)
   - [Login System](#login-system)
   - [Registered User Features](#registered-user-features)
   - [Seller Features](#seller-features)
   - [Admin Features](#admin-features)
   - [Payment and Buying System](#payment-and-buying-system)
5. [Installation and Execution](#installation-and-execution)
6. [Detailed Documentation](#detailed-documentation)

## Overview
E-commerce or electronic commerce (EC) involves buying and selling goods and services, or transmitting funds or data, over an electronic network, primarily the internet. These transactions can occur in various forms, including business-to-business (B2B), business-to-consumer (B2C), consumer-to-consumer (C2C), or consumer-to-business (C2B).

## Background Study
The objective of this project is to develop a secure e-commerce store where any products can be bought from the comfort of home through the internet. It is a virtual store on the Internet where customers can browse a catalog and select products of interest. The selected items are collected in a shopping cart, and at checkout, more information is needed to complete the transaction.

## Tools and Technologies
- **Language**: JavaScript, TypeScript
- **DBMS**: MongoDB
- **Frontend**: NextJS
- **Backend**: NestJS
- **Web Server**: Nginx

## General Functionality Walkthrough

### Viewing and Searching System
Users can browse available products on the home screen and search for products by name or filters such as categories, brands, and prices. A "Sort by" button allows sorting by price range. Dark mode is also available.

### Register System
Users can register by providing valid information. A valid email address is required, and invoices for purchases are sent there. Users must provide a name and a password within specified lengths and character restrictions.

### Login System
Registered users can log in using their email and password. They can access additional features like viewing and updating their profiles and applying to become a seller.

### Registered User Features
Registered users can update their profiles, receive notifications, and request to become sellers. Sellers can manage their inventory, create, edit, and delete products.

### Seller Features
Sellers can manage their profile, inventory, and products. They can create new products, providing details like name, price, category, brand, stock, and description.

### Admin Features
Admins have special login credentials. They can view and manage products and users, approve seller requests, and more.

### Payment and Buying System
Logged-in users can purchase products using a payment gateway. Users must provide valid payment details, including a dummy card number, and receive an invoice upon successful payment.

## Installation and Execution

To set up the project locally:

1. **Install Dependencies**: Run the following command to install the required modules:
   ```bash
   npm install
   ```

2. **Run Development Server**: Start the development server using:
   ```bash
   npm run dev
   ```

3. **Build for Production**: Build the project using:
   ```bash
   npm run build
   ```

4. **Start Production Server**: Start the server with:
   ```bash
   npm start
   ```

## Detailed Documentation

For more comprehensive information, refer to the full [documentation](https://drive.google.com/file/d/1CKgD3UUq1cPsc720k75BxMBK5nQ3xWfd/view?usp=drive_link)
