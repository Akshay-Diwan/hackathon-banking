const {PrismaClient} = require('../generate/prisma')
const prisma = new PrismaClient()
const {v4 : uuid} = require('uuid')
const { getCustomerID } = require('../utils/userInfo');

const kycdocumentController = async (req, res , component = false) => {
  try{
    console.log(req.body)
    const has_address_proof = false;
    const {
      documents,
      address,
      personal,
      nominee
    } = req.body
    const {
      aadhaar_number,
      pan_number,
    } = documents
    
    const customer_ID = getCustomerID(req)
    console.log(customer_ID)
    const files = req.files;

    // Validations
    if (!pan_number || pan_number.trim() === "") {
      return component? { error: "PAN Card number is required." }: res.status(400).json({ error: "PAN Card number is required." });
    }
    if(has_address_proof ==="yes" && !(addressLine1 && addressLine2 && addressLine3)){
      return component? { error:  "address is required." }:res.status(400).json({ error: "address is required." });
    }
    if (has_address_proof === "yes" && !files.address) {
      return component? { error:  "Address proof must be uploaded." }:res.status(400).json({ error: "Address proof must be uploaded." });
    }

    // Optional Aadhaar number but should be masked
    if (aadhaar_number && !/^\d{12}$/.test(aadhaar_number)) {
       logger(
      {
        customerId: getCustomerID(req),
        ipAddress: getClientIP(req),
        action : "KYC Submission",
        status : "ERROR", 
        details : "Invalid Aadhaar number"
      }
    )
      return component? { error:  "Invalid Aadhaar number" }:res.status(400).json({ error: "Invalid Aadhaar number." });
    }
    const kyc_ID = uuid()
    await prisma.kYC.create({
      data: {
        kycId: kyc_ID,
        aadhaarNumber: aadhaar_number,
        panNumber: pan_number,
        personalDetails: personal,
        address: address,
        nominee:nominee
      }
    })
    await prisma.user.update({
      where: {
        customerId: customer_ID
      },
      data:{
        kycId: kyc_ID
      }
    })
    // Store file info and fields (in DB or temp for now)
    const response = {
      aadhaarNumber: aadhaar_number ? "XXXX-XXXX-" + aadhaar_number.slice(-4) : null,
      pan_number,
      has_address_proof,
      filesUploaded: Object.keys(files),
      addressLine1,
      addressLine2,
      addressLine3,
      country,
      state,
      district,
      city,
      postalCode,
      gender,
      maritalStatus,
      religion,
      education,
      occupation,
      income,
      fatherName,
      motherName,
      dependents,
      birthDate
    };

    return component? { success: "KYC submitted successfully", data: response } :res.status(200).json({ success: "KYC submitted successfully", data: response });
  }
  catch(err) {
    console.log(err);
    return component? { error: "KYC could not be submitted" } :res.status(500).json({ error: "KYC could not be submitted", data: err });
    
  }
  }

module.exports = kycdocumentController;