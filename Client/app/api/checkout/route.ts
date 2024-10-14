import { NextResponse } from 'next/server';
import db from '../../../lib/db'; // Assuming a proper database connection setup

export async function POST(req: Request) {
  let connection;
  try {
    const { cart, user } = await req.json(); // Extract cart and user info from the request

    // Ensure that the user and product info are available
    if (!user?.username) throw new Error('Username is missing');
    if (!cart || cart.length === 0) throw new Error('Cart is empty');

    // Calculate total price for the transaction
    const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.price.toString()), 0);

    // Start a database transaction
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Insert each item in the cart into the Transactions table
    for (const item of cart) {
      if (!item.product_id) throw new Error('Product ID is missing'); // Ensure product_id exists

      await connection.query(
        `INSERT INTO Transactions 
        (username, transaction_date, total_price, quantity, product_id) 
        VALUES (?, ?, ?, ?, ?)`,
        [
          user.username, // Use username instead of user_id
          new Date(), // Current timestamp for transaction_date
          totalPrice,
          1, // Assuming quantity of 1 for each item
          item.product_id, // product_id from the cart
        ]
      );

      // Update inventory (decrease quantity_in_stock)
      await connection.query(
        'UPDATE Inventory SET quantity_in_stock = quantity_in_stock - 1 WHERE product_id = ? AND quantity_in_stock > 0',
        [item.product_id]
      );
    }

    await connection.commit(); // Commit the transaction
    connection.release(); // Release the connection

    return NextResponse.json({ message: 'Transaction completed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Transaction failed:', error);
    if (connection) await connection.rollback(); // Rollback transaction in case of error
    return NextResponse.json({ message: 'Transaction failed', error }, { status: 500 });
  }
}
