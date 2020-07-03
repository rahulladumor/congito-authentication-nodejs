//const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk')
global.fetch = require('node-fetch');


AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY
})

const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });
const appClient = '6sm45b19v3293fba7vf43naj11'
const poolId = 'us-east-1_JLtpcJXDi'


exports.createCognitoUser = async (req,res) => {
  const attr = req.body;
  let params = {
    UserPoolId: poolId,
    Username: attr.username,
    MessageAction: "SUPPRESS",
    TemporaryPassword: attr.password,
    UserAttributes: [
      {
        Name: "email",
        Value: attr.email
      },
      {
        Name: "name",
        Value: attr.name
      },
      {
        Name: "email_verified",
        Value: "true"
      }
    ]
  };
  return await cognito
    .adminCreateUser(params)
    .promise()
    .then(data => {
      let params = {
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        ClientId: appClient, 
        UserPoolId: poolId,
        AuthParameters: {
          USERNAME: attr.username,
          PASSWORD: attr.password
        }
      };
      return cognito.adminInitiateAuth(params).promise();
    })
    .then(async data => {
      let challengeResponseData = {
        USERNAME: attr.username,
        NEW_PASSWORD: attr.password
      };
      let params = {
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ClientId: appClient,
        UserPoolId: poolId,
        ChallengeResponses: challengeResponseData,
        Session: data.Session
      };
      const result = await cognito.adminRespondToAuthChallenge(params).promise()
      return res.status(200).json({
        success:true,
        data:result
      }) 
    })
}


exports.Login = async (req,res) => {
  try {
    const attr = req.body;

    let params = {
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      ClientId: appClient, 
      UserPoolId: poolId,
      AuthParameters: {
        USERNAME: attr.username,
        PASSWORD: attr.password
      }
    };
    const result = await cognito.adminInitiateAuth(params).promise();
    res.status(200).json({ 
      success:true,
      data: result
    }) 
  } catch (err) {
    res.status(401).json({result:err.message}) 
  }
}

exports.LogOut = async (req,res) => {
  try {
    const token = req.header('token').replace('Bearer ', '');
  await cognito.globalSignOut({
    AccessToken: token
  }).promise()
  res.status(200).json({success:true, data:"Succesfully Log Out"})
  } catch (err) {
    res.status(401).json({result:err.message})
  }
  
}

exports.getUser = async (req,res) => {
  try {
    const token = req.header('token').replace('Bearer ', '');
  let  data = await cognito.getUser({
    AccessToken: token
  }).promise()
  console.log(data.UserAttributes)
 res.status(200).json({data:data.Username, user:data.UserAttributes})
  } catch (err) {
    res.status(401).json({result:err.message})
  }
}

exports.hello = (req,res) => {
  try {
    const user = req.body.name;
    res.status(200).json({result:user})
  } catch (error) {
    res.send(error)
  }
 
}

// exports.validate_token = function(req, res){
//   let validate = authService.Validate(req.body.token,function(err, result){
//       if(err)
//           res.send(err.message);
//       res.send(result);
//   })
// }