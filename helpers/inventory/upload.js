// POST /inventory/upload -> (authenticated only)
// i.
// to upload csv/excel file with list of inventory_items
// ii.
// API has to verify if the user is OEM, and then set the OEM_excess field
// according to the entry. Otherwise, by default, OEM_excess should be set
// to false.
// iii.
// Inventory table needs to have a “hot_offer” field. Based on the entry in csv
// file, hot_offer should be set to true. By default, it should be set to false.
