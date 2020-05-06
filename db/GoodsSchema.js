const mongoose = require('mongoose');

let GoodsSchema = mongoose.Schema({
  productId:{
	  type:Number,
	  unique: true,
	  dropDups:true,
	  required: true
  },
  productName: {
    type: String
  },
  brand:{
	 type: String
  },
  maketPrice:{
	 type: String
  },
  socooPrice: {
    type: String
  },
  refPrice: {
    type: String
  },
  tipPrice:{
	 type: String
  },
  imgUrl:{
	  type: String
  },
  brandCnName:{
	  type: String
  },
  categoryId:{
	 type: String  
  },
  level:{
	 type:String
  }
});
 module.exports = mongoose.model('GoodsSchema', GoodsSchema);
