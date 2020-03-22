const { styles } = require('./email-styles');
const oemExcessTemplate = (name, template) => {
    return `
      <!doctype html>
      <html>
  
      <head>
        <meta name="viewport" content="width=device-width">
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
                <span class="preheader">OEM Excess parts - now available</span>
                <table class="main">
                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="wrapper">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <p>Hi ${name},</p>
                            <p>Below OEM Excess parts are now available.</p>
                            <p>Happy shopping at ICBaazzar!</p>
                            <div style="overflow-x:auto;">
                            <table class="data-table" cellpadding="0" cellspacing="0">
                              <thead>
                              <tr>
                                <th>Part no.</th>
                                <th>Manufacturer</th>
                                <th>DateCode</th>
                                <th>Quantity</th>
                                <th>Company Name</th>
                                <th>OEM Email</th>
                              </tr>
                              </thead>
                              <tbody>
                                ${template}
                              </tbody>
                            </table>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr> <!-- END MAIN CONTENT AREA -->
                </table> <!-- START FOOTER -->
                <div class="footer">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="content-block"> <span class="apple-link">ICBaazzar</span> <br> </td>
                    </tr>
                  </table>
                </div> <!-- END FOOTER -->
                <!-- END CENTERED WHITE CONTAINER -->
              </div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
  
      </html>
    `;
  }
  
  module.exports = { oemExcessTemplate };