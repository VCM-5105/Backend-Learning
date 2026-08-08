const asynchandler = (requestHandler) => {
   return (req, res, next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
 }

export { asynchandler }

/*
 this is the illustration of how a higher order function is passed 
const asynchandler = (func) => { } //simple arrow function
const asynchandler = (func) => () => { } // higher order function passed as function
const asynchandler=(func)=>{async()=>{}}

    */

// const asynchandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
//  }

    