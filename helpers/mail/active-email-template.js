const { styles } = require('./email-styles');
const activeEmailTemplate = (user, link) => {
    return `
    <!doctype html>
    <html>

    <head>
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      ${styles}
    </head>

    <body class="">
    <table border="0" cellpadding="0" cellspacing="0" class="body">
    <tr>
    <td>&nbsp;</td>
    <td class="container">
        <div class="content">
        <!-- START CENTERED WHITE CONTAINER -->
        <img
          src="https://s3-us-west-2.amazonaws.com/icbaazzar-app-dev-test-image/images/icbaazzar-logo-black.png"
          alt="ICBaazzar" />
        <span class="preheader">Account Activated</span>
            <table class="main">
            <!-- START MAIN CONTENT AREA -->
                <tr>
                  <td class="wrapper">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>    
                        <p>Congrats! Your ICBaazzar account: ${user.email_address} is activated</p>                      <p>You can login to the marketplace by clicking below:</p>                   <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">                        <tbody>                <tr>                   <td align="left">                              <table border="0" cellpadding="0" cellspacing="0">                                <tbody>                                 <tr>                                    <td> <a href=\"${link}\" target=\"_blank\">LogIn to ICBaazzar</a> </td>                                  </tr>                                </tbody>                              </table>                            </td>                          </tr>                        </tbody>                      </table>                      <p>Happy buying and selling IC Components!</p></td>                  </tr>                </table>              </td>            </tr>
                    <!-- END MAIN CONTENT AREA -->
                        </table>
                        <!-- START FOOTER -->
                        <div class="footer">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td class="content-block"><span class="apple-link">ICBaazzar</span><br></td>
                            </tr>
                          </table>
                        </div>
                        <!-- END FOOTER -->
                        <!-- END CENTERED WHITE CONTAINER -->
                        </div>
                        </td>
                        <td>&nbsp;
                        </td>
                        </tr>
                        </table>
                      </body>
                
                    </html>
                  `;
                
                }
                
module.exports = { activeEmailTemplate }