const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Middleware to parse cookies
router.use(cookieParser());

// User model/schema
const { User, Order } = require("../model/user");

// Sign up route
router.post("/signup", async (req, res) => {
  const {
    name,
    email,
    password,
    stateName,
    district,
    phone,
    pincode,
    address,
  } = req.body;

  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user document
  const user = new User({
    name,
    email,
    phone,
    stateName,
    district,
    pincode,
    address,
    password: hashedPassword,
  });

  // Save user to database
  await user.save();

  // Send response
  res.status(201).send("User created successfully.");
});

// Sign in route
router.post("/signin", async (req, res) => {
    const { email, password, phone } = req.body;
  
    // Find user by email
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    
    // If user doesn't exist, send error response
    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }
  
    // Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
  
    // If password is invalid, send error response
    if (!passwordMatch) {
      return res.status(401).send("Invalid email or password.");
    }
  
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "secret_key", {
      expiresIn: "1h",
    });
  
    // Store token in HTTP-only cookie
    res.cookie("jwt", token, {
     sameSite:"none",
      httpOnly:false
    });
  
    // Send success response
    if(passwordMatch){res.status(200).json({ message: "Success", token })}
    
  });
  

// Authentication middleware
const authMiddleware = async (req, res, next) => {
 const token = req.headers.authorization.split(" ")[1];

  // If token is missing, send error response
  if (!token) {
    return res.status(401).send("Authentication required.");
  }

  try {
    // Verify token with JWT
    const decoded = jwt.verify(token, "secret_key");

    // Find user by ID
    const user = await User.findById(decoded.userId);

    // If user not found, send error response
    if (!user) {
      return res.status(401).send("Authentication required.");
    }

    // Set user on request object for future use
    req.user = user;

    // Call next middleware
    next();
  } catch (error) {
    // If token is invalid or expired, send error response
    res.status(401).send("Authentication required.");
  }
};

// Protected route for getting user name
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).send(req.user.name);
});

// Log out route
router.post("/logout", (req, res) => {
  // Clear JWT cookie
  res.clearCookie("jwt");

  // Send success response
  res.status(200).send("Logged out successfully.");
});

router.post("/order", authMiddleware,async (req, res) => {
    try {
        const id = req.user.id
        // const id = "12345"
        const { items, orderStatus, userAddress,
            storePhoneNo,
            city,
            storeAddress,
            billAmt,
            storeLocation,
            orderDate } = req.body;
        const order = new Order({
            items,
            userId: id,
            userAddress,
            orderStatus,
            storePhoneNo,
            city,
            storeAddress,
            billAmt,
            storeLocation,
            orderDate
        });
        await order.save()
        //    const order  =await Order.create(req.body)
        res.send(order)
    } catch (error) {
        res.json({
            status: "failed",
            message: error.message
        })
    }
});

router.get('/orders',authMiddleware, async (req, res) => {
    try {
        const user = req.user.id
        // const user = "12345"
        const orders = await Order.find({ userId: user });
        if (orders) {
            res.status(200).json({
                status: "successfully getting orders",
                orders: orders
            })
        } else {
            res.status(500).json({
                status: "failed",
                message: "no order created by user"
            })
        }
    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        })
    }
})
router.put('/orders/:id',authMiddleware, async (req, res) => {
    const orderId = req.params.id;
    console.log(orderId);
    const newOrderStatus = req.body.orderStatus;
    try {
      const order = await Order.findByIdAndUpdate(orderId, { orderStatus: newOrderStatus });
      if (!order) {
        return res.status(404).send('Order not found');
      }
      res.send('Order status updated');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
module.exports = router;
