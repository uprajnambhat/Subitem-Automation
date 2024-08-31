const initMondayClient = require('monday-sdk-js');

/* 
function getColumnValue():
Extracts the list of changed(updated) column value, along with the column Id's of its respective suitems
 * @param {ID} token - session token
 * @param {ID} itemId - ID of the item being queried 
 * @param {ID} columnId - ID of the column being queried
 * @returns 
 */

const getColumnValue = async (token, itemId, columnId) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);
    mondayClient.setApiVersion('2024-04');

    const query = `query($itemId: [ID!], $columnId: [String!]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            value
          }
          subitems{
            id
            board{
              id
            }
          }

        }
      }`;

    const variables = { columnId, itemId };

    const response = await mondayClient.api(query, { variables });
    return response.data.items;
  } catch (err) {
    console.error(err);
  }
};

/*
 function changeColumnValue()

 Genric Monday GraphQL call to change columns.
 The column value to e changed needs to be seperately constructed as a JSON object and passed as 'value' parameter

 *  @param {ID} token - session token
 *  @param {ID} boardId - ID of the board being changed
 *  @param {ID} itemID - ID of the item being changed
 *  @param {ID} columnID - ID of the column being changed
 *  @param {JSON} value - JSON object with the details of column values being changed

*/

const changeColumnValue = async (token, boardId, itemId, columnId, value) => {
  try {
    const mondayClient = initMondayClient({ token });
    mondayClient.setApiVersion('2024-01');
    const query = `mutation change_column_value($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
        change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }
      `;
    const variables = { boardId, columnId, itemId, value };

    const response = await mondayClient.api(query, { variables });
    return response;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getColumnValue,
  changeColumnValue,
};
