const { getUser } = require('../../helpers/user/get');
const { getInventory } = require('../../helpers/inventory/get');
const sendMail = require('../../helpers/mail/send');
const { createQuoteTemplate } = require('../../helpers/mail/create-quote-template');
const { wishlistQuoteTemplate } = require('../../helpers/mail/wishlist-quote-template');
const { SENDER_EMAIL } = require('../../config/config.json');

const sendQuoteRequestMail = async (quote, user) => {
    const inventory = await getInventory({ id: quote.inventory_id });
    const seller = await getUser({ id: inventory['dataValues']['user_id'] })
    const emailText = `Hi, ${user.first_name} ${user.last_name} from ${user.company_name} requested a quote for your part number: ${inventory.part_number}. The requested quantity is ${quote.quantity}. You can contact the requestor at ${user.email_address}. \n ${quote.message}`
   
    await sendMail(SENDER_EMAIL, seller.email_address, 'ICBaazzar: Quote requested', emailText, createQuoteTemplate(user, inventory, quote));
}

const sendWishlistQuoteMail = async(wishlist, seller) => {
    const buyer = await getUser({ id: wishlist.userId})
    const emailText = `Hi, ${seller.first_name} ${seller.last_name} from ${seller.company_name} has a quote for your wanted part number: ${wishlist.part_number}. You can contact the seller at ${seller.email_address}. \n \n Please find below the message sent by the Seller: \n ${wishlist.messageToCustomer}`
   
    await sendMail(SENDER_EMAIL, buyer.email_address, 'ICBaazzar: Item You Wanted is Available', emailText, wishlistQuoteTemplate(wishlist, buyer, seller));
}

module.exports = { 
    sendQuoteRequestMail,
    sendWishlistQuoteMail
};