const { styles } = require('./email-styles');
const wishlistQuoteTemplate = (wishlist, buyer, seller) => {
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
                <span class="preheader">Wanted Item Available</span>
                <table class="main">
                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="wrapper">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <p>Hi,
                            </p>
                            <p>Hi, ${seller.first_name} ${seller.last_name} from ${seller.company_name} has a quote for your wanted part number: ${wishlist.partNumber}. You can contact the seller at ${seller.email_address}. </p><p>Message sent by the Seller:</p>
                            <p>${wishlist.messageToCustomer}</p>
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

module.exports = { wishlistQuoteTemplate }