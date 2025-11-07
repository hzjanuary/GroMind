const genAI = require('../config/gemini'); // Import Gemini client
const Product = require('../models/productModel'); // Import model Sản phẩm

// API 1: Gợi ý món ăn (Code của bạn)
const suggestRecipe = async (req, res) => {
  try {
    const { mainIngredient, availableProducts } = req.body;

    if (
      !mainIngredient ||
      !availableProducts ||
      availableProducts.length === 0
    ) {
      return res.status(400).json({ error: 'Thiếu dữ liệu.' });
    }

    const productNames = availableProducts.map((p) => p.name);
    const productListString = productNames.join(', ');
    const prompt = `
      Bạn là một trợ lý đầu bếp cho một website đi chợ online.
      Tôi muốn bạn gợi ý 1 món ăn nấu từ nguyên liệu chính là: "${mainIngredient}".
      Yêu cầu bắt buộc: 
      1. Món ăn bạn gợi ý CHỈ ĐƯỢC PHÉP sử dụng các nguyên liệu có trong danh sách sau: [${productListString}].
      2. KHÔNG được thêm bất kỳ nguyên liệu nào không có trong danh sách.
      Hãy trả lời với tên món ăn và các nguyên liệu cần dùng từ danh sách.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ suggestion: text });
  } catch (error) {
    console.error('Lỗi khi gọi Gemini API (Suggest):', error);
    res.status(500).json({ error: 'Lỗi server khi gọi AI.' });
  }
};

// ===== API 2: TÌM CÔNG THỨC BẰNG AI (Thêm mới) =====
const getRecipeDetails = async (req, res) => {
  try {
    const { dishName, availableProducts } = req.body;

    if (!dishName || !availableProducts || availableProducts.length === 0) {
      return res
        .status(400)
        .json({ error: 'Thiếu tên món ăn hoặc danh sách sản phẩm.' });
    }

    const productListString = availableProducts.join(', ');

    // Đây là "Prompt" (câu lệnh) thông minh
    const prompt = `
      Bạn là một đầu bếp chuyên nghiệp. Hãy cung cấp công thức chi tiết cho món ăn: "${dishName}".

      YÊU CẦU BẮT BUỘC: 
      1. Bạn CHỈ được phép sử dụng các nguyên liệu có trong danh sách sau: [${productListString}].
      2. KHÔNG được bịa ra nguyên liệu nào không có trong danh sách. Nếu món ăn gốc cần nguyên liệu không có (ví dụ: nước dừa), hãy bỏ qua và nấu với những gì có sẵn.
      
      Hãy trả lời dưới dạng một đối tượng JSON CHÍNH XÁC, không có bất kỳ chữ nào khác.
      Cấu trúc JSON phải là:
      {
        "name": "Tên món ăn (chuẩn hóa)",
        "instructions": "Các bước nấu (dùng \\n để xuống dòng)",
        "ingredients_needed": [
          "Tên nguyên liệu 1 (CHÍNH XÁC như trong danh sách)",
          "Tên nguyên liệu 2 (CHÍNH XÁC như trong danh sách)"
        ]
      }
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Lấy text và làm sạch (loại bỏ ```json và ```)
    let text = response.text();
    text = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const aiResponse = JSON.parse(text); // Chuyển text thành JSON

    // Bước cuối: Lấy thông tin đầy đủ (giá, đơn vị) của các nguyên liệu
    const ingredientsFromDB = await Product.find({
      name: { $in: aiResponse.ingredients_needed },
    });

    // Gửi về frontend
    res.json({
      name: aiResponse.name,
      instructions: aiResponse.instructions,
      // Gửi danh sách nguyên liệu đầy đủ (có id, giá, unit)
      ingredients: ingredientsFromDB.map((prod) => ({
        product: prod,
        quantity_description: '...', // AI v1 chưa giỏi định lượng, tạm để trống
      })),
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết công thức AI:', error);
    res.status(500).json({ error: 'Lỗi server khi gọi AI.' });
  }
};

// Xuất cả hai hàm
module.exports = {
  suggestRecipe,
  getRecipeDetails,
};
