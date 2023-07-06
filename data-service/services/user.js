const { send } = require('process');
const { addFilter, genInsertQ, genUpdateQ, db,genInsertFullQ, insertIntoTable } = require('./common');
const moment = require('moment');

const userLogin = async (req) => {
    let data = req.body
    let query = await insertIntoTable({query: `select COUNT(*) as userCount from [dbo].[KS_Users] where [KS_Users_email] = '${data.KS_Users_email}' and [KS_Users_passwordHash] = '${data.KS_Users_passwordHash}'`});
    console.log('query',query)
   return(query)
};

const userSignUp = async (req) =>{
    let data = req.body;
    let queryResult = await db({query:
    `INSERT INTO KS_Users
    (KS_User_UserTypeid
    ,KS_Users_firstName
    ,KS_Users_middleName
    ,KS_Users_lastName
    ,KS_Users_mobile
    ,KS_Users_Alternate_mobile
    ,KS_Users_email
    ,KS_Users_passwordHash
    ,KS_Users_admin
    ,KS_Users_vendor
    ,KS_Users_registeredAt
    ,KS_Users_lastLogin
    ,KS_Users_intro
    ,KS_Users_profile
    ,KS_Users_createdAt
    ,KS_Users_ModifiedA)
    OUTPUT INSERTED.KS_Usersid
VALUES
    (${data.KS_User_UserTypeid}
    ,'${data.KS_Users_firstName}'
    ,'${data.KS_Users_middleName}'
    ,'${data.KS_Users_lastName}'
    ,'${data.KS_Users_mobile}'
    ,'${data.KS_Users_Alternate_mobile}'
    ,'${data.KS_Users_email}'
    ,'${data.KS_Users_passwordHash}'
    , ${data.KS_Users_admin}
    , ${data.KS_Users_vendor}
    ,'${data.KS_Users_registeredAt}'
    ,'${data.KS_Users_lastLogin}'
    ,'${data.KS_Users_intro}'
    ,'${data.KS_Users_profile}'
    ,'${data.KS_Users_createdAt}'
    ,'${data.KS_Users_ModifiedA}')`
})
    return queryResult;

}




module.exports = { userLogin, userSignUp };