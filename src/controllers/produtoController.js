const Produto = require('../models/ProdutoModel');

exports.index = async (req, res) => {
  try {
    const produtos = await Produto.buscaProdutos();

    
    const notaFiscal = null;

    res.render('index', { produtos, notaFiscal });
  } catch (error) {
    console.error('Erro no controlador index:', error);
    res.render('404');
  }
};


exports.register = async (req, res) => {
  try {
    const produto = new Produto(req.body);
    await produto.register();
    res.redirect('/');
  } catch (error) {
    console.error('Erro ao registrar produto:', error);
    res.render('404');
  }
};


exports.gerarNotaFiscal = (req, res) => {
  try {
    const { destinatario, endereco, valorVenda, irpf, pis, cofins, inss, issqn } = req.body;

    // Validação básica de campos obrigatórios
    if (!destinatario || !endereco || !valorVenda || !irpf || !pis || !cofins || !inss || !issqn) {
      return res.status(400).render('index', { error: "Todos os campos são obrigatórios!" });
    }

    const valorVendaNumber = parseFloat(valorVenda);
    if (isNaN(valorVendaNumber) || valorVendaNumber <= 0) {
      return res.status(400).render('index', { error: "Valor de venda inválido!" });
    }

    // Cálculo dos impostos
    const impostos = {
      irpf: parseFloat((valorVendaNumber * (irpf / 100)).toFixed(2)),
      pis: parseFloat((valorVendaNumber * (pis / 100)).toFixed(2)),
      cofins: parseFloat((valorVendaNumber * (cofins / 100)).toFixed(2)),
      inss: parseFloat((valorVendaNumber * (inss / 100)).toFixed(2)),
      issqn: parseFloat((valorVendaNumber * (issqn / 100)).toFixed(2)),
    };

    // Total de impostos
    const totalImpostos = Object.values(impostos).reduce((acc, imposto) => acc + imposto, 0);
    const valorLiquido = valorVendaNumber - totalImpostos;

    // Exibição da Nota Fiscal
    res.render('index', {
      notaFiscal: {
        destinatario,
        endereco,
        valorVenda: valorVendaNumber.toFixed(2),
        impostosTotais: totalImpostos.toFixed(2),
        valorLiquido: valorLiquido.toFixed(2),
        ...impostos,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar nota fiscal:', error);
    res.status(500).render('404', { error: "Ocorreu um erro ao gerar a nota fiscal." });
  }
};

