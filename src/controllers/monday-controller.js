const mondayService = require('../services/monday-service');
const transformationService = require('../services/transformation-service');
const { TRANSFORMATION_TYPES } = require('../constants/transformation');

/*
function updateSubitems():

Handle the logic for the elow Automation
Automation: "When column changes on an item, change its subitems' column to the same value ";
*/

async function updateSubitems(req, res) {
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  try {
    const { inputFields } = payload;
    const { boardId, itemId, columnId } = inputFields;
    const [{ column_values = [], subitems = [] }] = await mondayService.getColumnValue(
      shortLivedToken,
      itemId,
      columnId
    );

    //Step 1 - Create the responseValue variable for mutation of subItem column
    const responseValue = column_values[0]?.value;

    //Step 2 - Call Monday GraphQL API to change the column
    subitems.forEach(async (element) => {
      const { id: subitemId = '', board: { id: subitemBoardId = '' } = {} } = element;
      await mondayService.changeColumnValue(shortLivedToken, subitemBoardId, subitemId, columnId, responseValue);
    });

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

module.exports = {
  updateSubitems,
};
