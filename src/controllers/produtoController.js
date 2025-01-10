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

    
    const valorVendaNumber = parseFloat(valorVenda);

    
    const impostos = {
      irpf: parseFloat((valorVendaNumber * (irpf / 100)).toFixed(2)),
      pis: parseFloat((valorVendaNumber * (pis / 100)).toFixed(2)),
      cofins: parseFloat((valorVendaNumber * (cofins / 100)).toFixed(2)),
      inss: parseFloat((valorVendaNumber * (inss / 100)).toFixed(2)),
      issqn: parseFloat((valorVendaNumber * (issqn / 100)).toFixed(2)),
    };

    
    const totalImpostos = Object.values(impostos).reduce((acc, imposto) => acc + imposto, 0);

    
    const valorLiquido = valorVendaNumber - totalImpostos;

    
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
    res.status(500).render('404');
  }
};
