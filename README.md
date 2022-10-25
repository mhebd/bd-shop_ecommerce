# BD Shop API Documentation

This is BD-Shop ecommerce backend server (Node, Express & Mongoose) project.

## All API section

```
  User
  Product
  Category
  Order
  Cart Item
```

## Basic authentication rules

> Public - Any user can access

> Private - Only login user can access

> Limited - Only admin can access

## User section endpoint

```
  1. ../api/v1/user
    - [GET - Private]
    - [PUT - Private]
    - [DELETE - Private]
  2. ../api/v1/user/all
    - [GET - Limited]
  3. ../api/v1/user/signup
    - [POST - Public]
  4. ../api/v1/user/login
    - [POST - Public]
  5. ../api/v1/user/:id
    - [GET - Limited]
    - [DELETE - Limited]
```

## Category section endpoint

```
  1. ../api/v1/category
    - [GET - Limited]
    - [POST - Limited]
  2. ../api/v1/category/:id
    - [PUT - Limited]
    - [DELETE - Limited]
```

## Product section endpoint

```
  1. ../api/v1/product
    - [GET - Public]
    - [POST - Limited]
  2. ../api/v1/product/:id
    - [GET - Public]
    - [PUT - Limited]
    - [DELETE - Limited]
```

## Cart Item section endpoint

```
  1. ../api/v1/cart-item
    - [GET - Private]
    - [POST - Private]
  .2 ../api/v1/cart-item/:id
    - [PUT - Private]
    - [DELETE - Private]
```

## Order section endpoint

```
  1. ../api/v1/order
    - [GET - Private]
    - [POST - Private]
  2. ../api/v1/order/all
    - [GET - Limited]
  3. ../api/v1/order/:id
    - [PUT - Private]
    - [DELETE - Private]
```
