const { styles } = require('./email-styles');
const createQuoteTemplate = (user, inventory, quote) => {
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
            <td>&nbsp;

            </td>
            <td class="container">
              <div class="content">
                <!-- START CENTERED WHITE CONTAINER -->
                <img
                  src="https://s3-us-west-2.amazonaws.com/icbaazzar-app-dev-test-image/images/icbaazzar-logo-black.png"
                  alt="ICBaazzar" />
                <span class="preheader">Quote Requested</span>
                <table class="main">
                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="wrapper">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <p>Hi,
                            </p>
                            <p>${user.first_name} ${user.last_name} from ${user.company_name} requested a quote for your part number: ${inventory.part_number}. The requested quantity is ${quote.quantity}.</p>
                            <p>You can contact the requestor at ${
user.email_address}.</p> <p>Below message was sent by the requestor:</p>
                            <p>${quote.message}
                            </p>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </table>
            </td>
          </tr>
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

module.exports = { createQuoteTemplate }