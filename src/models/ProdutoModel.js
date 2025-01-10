// ProdutoModel.js
const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
    produto: { type: String, required: true },
    valor: { type: Number, required: true }
});

const ProdutoModel = mongoose.model('Produto', ProdutoSchema);

function Produto(body) {
    this.body = body;
    this.produto = null;
}

Produto.prototype.register = async function () {
    this.produto = await ProdutoModel.create(this.body);
};

Produto.buscaProdutos = async function () {
    return await ProdutoModel.find().sort({ criadoEm: -1 });
};

module.exports = Produto;
