const languages = {
  'CN': {
    text01: '创建钱包',
    text02: '没有钱包',
    text03: '导入钱包',
    text04: '已有钱包',
    text05: '我已阅读并同意《用户协议》',
    text06: '创建钱包',
    text07: '钱包名称',
    text08: '1~10个字符',
    text09: '钱包密码',
    text10: '设置钱包密码（不少于8位）',
    text11: '重复输入确认钱包密码',
    text12: '创建（按钮文字）',
    text13: '报错提示：密码不一致！',
    text14: '备份助记词',
    text15: '备份提示',
    text16: `Hermit Wallet 不会为您保存钱包助记词，请自行备份保管。
             获得助记词即拥有资产，为确保安全，请勿截图或在线保存助记词。`,
    text17: '备份钱包',
    text18: '请按顺序备份助记词，确保备份无误。',
    text19: '已完成备份',
    text20: '验证助记词',
    text21: '请根据已备份好的助记词按顺序选择',
    text22: '确认',
    text23: '助记词错误，请重新确认！',
    text24: '钱包创建成功',
    text25: '助记词',
    text26: '由单词组成，以空格隔开',
    text27: '私钥',
    text28: '明文私钥',
    text29: 'Keystore',
    text30: '加密的私钥 JSON',
    text31: '助记词导入',
    text32: '助记词（空格隔开填入）',
    text33: '输入助记词单词，使用空格隔开',
    text34: '钱包密码',
    text35: '设置钱包密码（不少于8位）',
    text36: '重复输入确认钱包密码',
    text37: '钱包名称',
    text38: '设置钱包名称',
    text39: '导入',
    text40: '为无效助记词，请检查！',
    text41: '助记词错误，请检查！',
    text42: '前后密码不一致，请重新输入！',
    text43: '导入成功！',
    text44: '私钥导入',
    text45: '钱包密码',
    text46: '设置钱包密码（不少于8位）',
    text47: '重复输入确认钱包密码',
    text48: '钱包名称',
    text49: '设置钱包名称',
    text50: '请输入有效私钥！',
    text51: '前后密码不一致，请重新输入！',
    text52: '导入成功！',
    text53: 'Keystore导入',
    text54: '输入Keystore文件内容',
    text55: '钱包密码',
    text56: '输入Keystore原对应钱包密码',
    text57: '输入钱包名称',
    text58: '导入',
    text59: '不正确的Keystore内容，请检查！',
    text60: 'Keystore原对应钱包密码错误，请确认！',
    text61: '导入成功！',
    text62: '选择导入类型',
    text63: 'Keystore 不能为空',
    text64: '钱包密码不能为空',
    text65: '钱包名称不能为空',
    text66: '创建您自己的钱包',
    text67: '保护您的资产',
    text68: '用户协议',
    text69: '获得助记词等于拥有钱包资产所有权',
    text70: '下一步',
    text71: '请勿截图',
    text72: '输入明文私钥',
    text73: '请按顺序抄写助记词，确保备份正确。',
    text74: '妥善保管助记词至隔离网络的安全地方。',
    text75: '请勿将助记词在联网环境下分享和存储，比如邮件、相册、社交应用等。  ',
    text76: '设置钱包名称',
    text77: '助记词由英文单词组成，请抄写并妥善保管。',
    text78: '助记词丢失，无法找回，请务必备份助记词。',
    text79: '钱包密码不能为空！',
    text80: '密码长度不能少于8位',
    text81: '私钥不能为空',
    text82: '导入',
    text83: '输入Keystore原对应资金密码',
    text84: '密码输入不一致，请重新输入',
    text85: '钱包名称不能超过10个字符',
    text86: '钱包已存在，请勿导入相同的钱包',
    text87: `ㅤㅤHermit Matrix Network（以下简称我或者我们）是专业从事区块链软件的极客开发组织，专注于利用去中心化技术为像您这样的个人（“您”或“您的”）提供可信的数字资产管理服务。我们托管一个顶级域名站：https://Hermit.ink，该网站提供有关Hermit和我们的产品的信息，以及我们产品的子域（“网站”）信息，其中包括文本、图像、音频、代码和其他材料或第三方信息。<br>
    
    由于越来越多的诈骗者想方设法欺骗毫无戒心的受害者的数字资产，请您在每次访问我们的域名站时验证SSL证书。在从您正在访问的网站下载、点击或以其他方式与之交互之前，请确保SSL证书的真实性。为免疑义，我们无法控制任何第三方网站或服务的内容、隐私政策或行为，也不对其承担任何责任。对于因使用或依赖任何此类网站或服务上或通过此类网站或服务提供的任何此类内容、商品或服务而造成或声称造成的任何损害或损失，我们概不负责或承担任何直接或间接责任。<br>
    
    本《服务协议》（“协议”或“服务协议”）包含管理您访问和使用我们提供的网站和服务（定义如下）的条款和条件，并且是我们与您或您所代表的实体之间的协议。在使用本网站或服务之前，请仔细阅读本《服务协议》。通过使用本网站，或单击按钮或复选框以接受或同意本《服务协议》的服务条款（如有该选项），或者填写服务订单，或者，如果更早，使用或以其他方式访问服务（“生效日期”），您(1)接受并同意本《服务协议》以及我们不时发布的任何附加条款、规则和参与条件，以及(2)同意如我们的《隐私政策》中所述的收集、使用、披露和其他处理信息的活动。如果您不同意本《服务协议》，则您不得访问或使用服务。<br>
    
    我们在此特别提醒您在使用我们的Hermit移动应用（以下简称“Hermit”或“本软件”， Hermit可在各移动应用平台上下载，包括但不限于Google Play Store和Apple App Store）之前，请认真阅读本《服务协议》及本《服务协议》中提及的其他文件，尤其是本《服务协议》中“免责及责任限制”条款，确保您充分理解本《服务协议》中各条款，并自主考虑使用Hermit的风险。<br>
    
    一、关于本《服务协议》的确认与接纳<br>
    1.您理解本《服务协议》及有关协议适用于Hermit及Hermit上我们所自主开发和拥有的去中心化应用（简称“DApp”）（排除第三方开发的DApp）。<br>
    2.您下载Hermit软件并创建身份、恢复身份（定义见下文）或导入钱包，即视为您已经充分阅读并接受本《服务协议》全部条款，本《服务协议》立即生效，对双方具有约束力。如果您不同意本《服务协议》条款，您必须立即停止使用Hermit。如果您已经下载了Hermit，请立即删除。<br>
    3.在访问或使用Hermit时, 您同意：<br>
    （1）接受本《服务协议》最新版本的约束（不变更亦不修改）；<br>
    （2）在您所适用的司法管辖区域内，您已达到使用Hermit的法定年龄，并可承担因使用Hermit而产生的有约束力法律或金钱义务；<br>
    （3）您不属于被排除人士（如下文所定义）。<br>
    4.本《服务协议》可由我们随时更新，经修改的《服务协议》一经在我们的网站上公布，立即自动生效，不再另行通知。在我们公布修改协议条款后，如果您不接受修改后的条款，请立即停止使用Hermit。<br>
    5.提请您关注，您在对本《服务条款》进行任何此类修改后使用Hermit即表示您接受这些修改后的《服务条款》。<br>
    二、定义<br>
    1.中国：指中华人民共和国，包含(1)香港特别行政区、(2)澳门特别行政区和(3)台湾地区。<br>
    2. Hermit：指由我们基于分布式账本技术开发的多币种数字钱包，包括其他为方便您使用区块链系统而开发的辅助工具。<br>
    3.被排除人士：<br>
    （1）除了自然人以外的、具备订立本《服务协议》的法律和意识能力的人士；或<br>
    （2）因本《服务协议》、法律、监管要求或适用于该用户的司法管辖区的规定而被以任何形式或方式（全部或部分）禁止、限制、无授权或无资格使用服务（如本《服务协议》所定义）的人。<br>
    （3）为免疑义，居住在中国境内的居民和/或定居在中国境内的用户亦涵盖在“被排除人士”的定义内。<br>
    我们不向被排除人士提供服务。如果您是被排除人士，请立即停止使用我们的服务。如果您继续使用我们的服务，您承认并同意您将根据您居住的司法管辖区的适用法律、法规和规定承担所有相应的责任，并且您应使得我们免于承担因您的此类使用行为而引起的任何责任，包括但不限于因此类违反、违约、违法而对我们造成的损失、第三方索赔或行政处罚，以及合理的法律和行政成本、费用和开支，包括合理的律师费在内。<br>
    
    4.身份：指基于您的公私钥对生成的数字识别身份。<br>
    5.新手指南：指在您使用Hermit之前（及在将来的使用过程中），我们为您提供的Hermit操作指南，以帮助您了解区块链的基础知识。<br>
    6.创建或导入钱包：指在您接受本《服务协议》后，使用Hermit创建或导入钱包的过程。<br>
    7.钱包密码：指您在创建Hermit钱包过程中，由您决定的密码，该密码将被用于加密和保护您的私钥。Hermit作为去中心化的应用，钱包密码不存储在您的这台移动设备或我们的服务器，一旦您丢失或忘记钱包密码，您需要借助私钥或助记词重置钱包密码。<br>
    8.信息提示：Hermit软件操作界面涉及的信息提示内容，建议您按照相关步骤进行操作。<br>
    9.特定用户：指按照新加坡和其他国家的法律法规及政策规定必须要配合我们履行个人信息披露义务的用户。<br>
    10.开发者用户：指按照我们的通知及相关开源协议规定使用Hermit开源代码和开发者模式等针对开发者提供的服务的用户。<br>
    11.私钥：由256位随机字符构成，是用户拥有并使用数字代币的核心。<br>
    12.公钥：由私钥借助密码学原理单向推导生成，并用以生成区块链数字钱包地址，数字钱包地址即为公开收款地址。<br>
    13.助记词：符合区块链BIP39行业标准，由随机算法生成的12（或15/18/21/24）个有序单词组成。是私钥的易记录表现形式，方便您备份保管。<br>
    14.Keystore: 是私钥或助记词经过您设置的钱包密码加密保存的文件形式，它只存储在您的这台移动设备中，不会同步至我们的服务器。<br>
    15.数字代币：指Hermit目前支持的数字代币种类，包括但不限于BTC、ETH等。<br>
    16.资料：指Hermit上“浏览”、“市场”等版块的文章等资料，这些资料均为第三方所有，未经授权不得转载。这些资料仅供您参考，并不构成我们对您交易的指导或建议。<br>
    17.消息中心：指您可以接收我们发出的信息或通知的收件箱。<br>
    18.个人信息：指以电子或者其他方式记录的能够单独或者与其他信息结合识别用户个人身份的各种信息，包括但不限于个人生物识别信息、邮件地址、钱包地址、移动设备信息、操作记录、交易记录等，但不包括用户的钱包密码、私钥、助记词、Keystore。<br>
    19.智能合约：指一种旨在以信息化方式传播、验证或执行合同的、基于以太坊的智能化合约，包括但不限于后文提及Tokenlon智能合约。<br>
    20.WETH：指以太币代币化，因为以太币不符合自己的ERC20标准，包装以太币代币化，方便以太币直接与其他代币交易。Hermit所支持代币与WETH的兑换比率由第三方智能合约决定。<br>
    21.ETH：指以太币，是与以太坊区块链相关的加密数字代币，为避免疑问，其不包括“以太坊经典”。<br>
    22. Hermit开源代码（“Hermit OSC”）：指我们公开宣布开源的部分Hermit软件代码，允许开发者用户在遵循相关开源协议及我们通知的规定下使用（包括二次开发）该部分开源代码。<br>
    23.开源协议：指开发者用户使用Hermit开源代码所应遵循的第三方开源协议。<br>
    24.第三方服务：指第三方DApp、第三方智能合约、第三方开源协议、第三方硬件钱包、第三方网页、第三方交易所等第三方提供的产品和服务。<br>
    三、Hermit服务（统称“服务”）<br>
    1.创建和恢复身份。您可以使用Hermit提供的“创建身份”、“恢复身份”按键进行身份的创建和恢复，并能在一个身份下，同时管理多链钱包。<br>
    2.导入钱包。对Hermit支持的数字代币，您可以使用Hermit生成新钱包或导入相关区块链系统的其它钱包工具生成的兼容钱包。<br>
    3.转账、收款。您可以使用Hermit的转账、收款功能进行数字代币的管理，即运用私钥进行电子签名，对相关区块链的账本进行修改。转账是指付款方利用收款方的ENS域名或区块链地址进行转账操作，该“转账”行为涉及在相关区块链系统的分布式账本中对该交易的有效记录（而非在Hermit上实际交付或转让数字代币）。<br>
    4.行情查看。您可以使用Hermit查看第三方提供的数字代币汇率价格。Hermit通过抓取相应的数字代币汇率信息并展示在Hermit中的“市场”版块。<br>
    5.管理数字代币。您可以从Hermit操作界面添加、保管或移除Hermit所支持的数字代币（ETH、BTC除外）。<br>
    6.币币兑换（DEX）。您可以与使用第三方Hermit智能合约的第三方进行数字代币兑换，由Hermit作为界面工具帮助您和第三方智能合约交互并显示该数字代币兑换的相应结果。<br>
    7.浏览DApp。您通过Hermit访问并使用该DApp（包括我们自己的DApp和第三方DApp）提供的服务。<br>
    8.搜索DApp。您通过Hermit的搜索框，可以对已在Hermit罗列的DApp进行搜索。<br>
    9.集成硬件钱包。您可以使用合适版本的Hermit与特定的硬件钱包进行匹配，并利用硬件钱包确认通过Hermit所进行的交易。<br>
    10.免密支付。您可以使用Hermit中的免密支付功能，免密支付将用户钱包密码通过安全加密算法存储至您的手机设备的Keychain/Keystore中，交易时调用您的生物识别（指纹或面容）鉴权，快速完成支付与签名。<br>
    11.开发者模式。为方便开发者用户，在开发者模式下开发者用户可以通过搜索框键入URL而访问任何其他网站和未在Hermit集成的第三方DApp。<br>
    12.交易记录。我们将通过区块链系统拷贝您全部或部分的交易记录。但您应以区块链系统的最新交易记录为准。<br>
    13.暂停服务。您知悉，基于区块链系统交易“不可撤销”的属性，我们不能为您撤回或撤销交易操作，但在一定情况下，我们可以暂停或者限制某位用户对Hermit软件的操作。<br>
    14.其他我们认为有必要提供的服务。<br>
    用户使用Hermit时了解并接受：<br>
    1.秉承着区块链的去中心化特点，并为了保护您数字代币安全，我们提供的是去中心化服务，大大区别于银行业金融机构。您了解并接受，我们不承担以下责任：<br>
    （1）存储您的钱包密码（即您创建/导入钱包时设置的密码）、私钥、助记词或Keystore；<br>
    （2）找回您的钱包密码、私钥、助记词或Keystore；<br>
    （3）冻结钱包；<br>
    （4）挂失钱包；<br>
    （5）恢复钱包；或<br>
    （6）交易回滚。<br>
    2.您应当自行承担保管含有Hermit的移动设备、备份Hermit、备份钱包密码、助记词、私钥及Keystore的责任。如您遗失移动设备、删除且未备份Hermit、删除且未备份钱包、钱包被盗或遗忘钱包密码、私钥、助记词或Keystore，我们均无法还原钱包或找回钱包密码、私钥、助记词或Keystore；如用户进行交易时误操作（例如输错转账地址、输错兑换数额），我们无法取消交易，且我们亦不应对此承担任何责任。<br>
    3.如您使用Hermit的免密支付功能，请您妥善备份钱包密码。当您的指纹或面容识别多次验证失败之后，您将需要输入自己的钱包密码。如果您遗忘钱包密码的，您需要通过导入助记词/私钥的方式，设置新的钱包密码。我们不存储您的指纹、面容识别等生物信息，且我们亦不应对此承担任何责任。<br>
    4. Hermit所能够提供的数字代币管理服务并未包括所有已存在的数字代币，请勿通过Hermit操作任何Hermit不支持的数字代币。<br>
    5. Hermit上集成的DApp包括我们自主拥有的DApp和第三方平台提供的DApp。对于第三方平台提供的DApp，Hermit仅为用户进入DApp提供搜索和区块链浏览器功能，不对第三方DApp的功能或服务质量提供任何担保。您在第三方DApp上接受服务或进行交易前应自行判断和评估该第三方DApp提供的服务或交易是否存在风险。<br>
    6. Hermit上提供的币币兑换功能的实质是您使用第三方智能合约在区块链系统上进行的数字代币兑换。对于第三方智能合约提供的服务，Hermit仅为您提供与第三方智能合约交互的工具，不对第三方智能合约的功能或服务质量提供任何担保。您在该第三方智能合约上接受服务或进行交易前应自行判断和评估该第三方智能合约提供的服务或交易是否存在风险。我们强烈建议您阅读相关智能合约的不断更新的用户协议和/或免责声明。我们保留出于任何原因立即终止或暂停访问这些第三方服务的权利，恕不另行通知或承担责任。<br>
    7. Hermit上集成的硬件钱包由第三方提供，Hermit不对第三方硬件钱包的功能或服务质量提供任何担保，且Hermit不保证实现与任何种类和版本的硬件钱包之间的匹配功能（具体请以我们不时作出的通知为准）。用户在使用第三方硬件钱包之前应自行判断和评估该硬件钱包是否存在风险。您应仔细阅读并同意相关硬件钱包的不断更新的使用许可协议等文件。<br>
    8.您在Hermit上使用开发者模式通过输入URL访问其他网站或未在Hermit集成的第三方DApps的，您知悉并同意您了解URL链接的网站和第三方DApps可能存在的安全隐患，并独立承担所有的风险和后果。<br>
    四、您的权利义务<br>
    （一）创建或导入钱包<br>
    1.创建或导入钱包。您有权在您的移动设备上通过Hermit创建和/或导入钱包，有权设定钱包的钱包密码等信息，并有权通过Hermit应用程序，使用自己的钱包在区块链上进行转账和收款等交易。<br>
    2.身份验证。按照有关法律法规的要求，特定用户在使用Hermit提供的有关服务时，应当按照Hermit的提示及时完成相关身份验证，要求您提交包括但不限于您的姓名、身份证号码、手机号码、银行卡号信息等个人信息。否则该特定用户将无法使用有关服务，因特定用户拖延造成的损失由您自行承担。<br>
    3.我们可能为不同的终端设备开发不同的软件版本，您应当根据实际需要选择下载合适的版本进行安装。如果您从未经合法授权的第三方获取本软件或与本软件名称相同的安装程序，我们将无法保证该软件能否正常使用，也无法保证其安全性，因此造成的损失由您自行承担。<br>
    4.本软件新版本发布后，旧版软件可能无法使用。我们不保证旧版软件的安全性、继续可用性及提供相应的客户服务。请您随时核对并下载最新版本。<br>
    （二）使用Hermit<br>
    1.您应自行承担妥善保管移动设备、钱包密码、私钥、助记词和Keystore等信息的责任。我们不负责为您保管以上信息。因您遗失移动设备或硬件钱包、主动或被动泄露、遗忘钱包密码、私钥、助记词、Keystore或遭受他人攻击、诈骗等所引起的一切风险、责任、损失、费用应由您自行承担。<br>
    2. Hermit信息提示。您了解并同意遵循我们在Hermit上发布的信息提示，按照信息提示的内容进行操作，否则，由此引起的一切风险、责任、损失、费用等应由您自行承担。<br>
    3.您知悉并理解Hermit没有义务对第三方服务履行尽职调查义务，您应当谨慎评估并承担所有与使用Hermit有关的风险。<br>
    4.提供信息和文件。如果我们自行认为有必要获取用户的相关信息以遵循任何与使用或操作Hermit相关的适用法律或法规的规定，您应按照我们的要求及时向我们提供该等信息，且您了解并接受，我们可以限制、暂停或终止您使用Hermit直到您提供满足我们要求的信息。您承诺及时向我们告知任何有关其依据本《服务协议》向我们提供的文件和信息中的任何变化，且在没有通知任何变化的书面通知的情形下，我们有权认为由您提供的文件和信息的内容是真实、正确、没有误导信息且没有发生改变的。<br>
    5.完成身份验证。当我们合理认为您的交易行为或交易情况出现异常的，或认为您的身份信息存在疑点的，或我们认为应核对您身份证件或其他必要文件的情形时，请您积极配合我们核对您的有效身份证件或其他必要文件，及时完成相关的身份验证。<br>
    6.转账。<br>
    （1）您知悉对于Hermit服务中您可使用的日计转账限额和笔数，可能因为您使用该转账服务时所处的国家/地区、监管要求、转账目的、Hermit风险控制、身份验证等事由而不同。<br>
    （2）您理解基于区块链操作的“不可撤销”属性，当您使用Hermit转账功能时，您应当自行承担因您操作失误而导致的后果（包括但不限于因您输错转账地址、您自身选择转账节点服务器的问题）。<br>
    （3）您知悉在使用Hermit服务时，以下情况的出现可能导致转账功能不可用、转账“交易失败”或“打包超时”：<br>
    a)钱包余额不足；<br>
    b)交易矿工费不足；<br>
    c)区块链执行智能合约代码失败；<br>
    d)超出监管部门、Hermit或法律法规规定的付款额度；<br>
    e)网络、设备等技术故障；<br>
    f)区块链网络拥堵、故障等原因引起交易被抛弃；<br>
    g)您的地址或交易对方地址被识别为特殊地址，如高风险地址。<br>
    （4）您知悉Hermit仅向您提供转账工具，在您使用Hermit完成转账后，我们即完成了当次服务的所有义务，我们对其他相关纠纷争议，不承担任何责任。<br>
    7.币币兑换。您知悉，币币兑换的每日限额目前由第三方智能合约限定。我们亦可能对您每日可币币兑换的额度进行限制并不时调整。<br>
    8.合法合规。您知悉在Hermit进行操作时或利用Hermit上的DApp、智能合约进行交易时，您应当遵循有关法律法规、国家政策的要求。<br>
    9.公告通知。Hermit会以网站公告、消息中心信息、弹窗提示或客户端通知等方式向您发送通知，例如通知您交易进展情况，或者提示您进行相关操作，请您及时予以关注。<br>
    10.服务费用与纳税义务：<br>
    （1）您使用Hermit的币币兑换服务时，第三方智能合约会向您收取手续费和/或服务费，具体费用以第三方智能合约收取数额为准，Hermit信息提示仅供参考；<br>
    （2）我们暂时不向您收取任何形式的服务费或手续费，将来需对某些服务进行收费时我们将另行约定或公布规则；<br>
    （3）您使用Hermit进行转账时应支付“矿工费”或网络费，金额由您自行决定，并由相关区块链网络收取；<br>
    （4）您知悉，在特定情况（包括但不限于您在转账期间为转账支付的“矿工费”或网络费不足，或相关区块链网络不稳定）下，您的转账操作可能失败；在该等情况下，即便您的转账操作未完成，您亦会被相关区块链网络收取矿工费；<br>
    （5）您因在Hermit进行交易而发生的所有应纳税负及其它方面的费用均由您负责支付。<br>
    （三）开发者用户基于Hermit开源代码的开发<br>
    1.开发者用户有权使用我们在官方渠道公布的Hermit开源代码进行应用程序的二次开发，并下载和使用我们针对Hermit开源代码发布的任何补丁或漏洞解决方案。<br>
    2.在使用Hermit开源代码时，开发者用户知悉并同意：<br>
    （1）如开发者用户在使用Hermit开源代码过程中发现任何漏洞、缺陷或软件改进方案的，应及时联系并告知我们，同时停止任何具有危害性的使用行为（如适用）；<br>
    （2）Hermit开源代码中可能包含第三方开源协议和源代码，我们不对该等第三方开源协议和源代码的功能、无病毒危害、无漏洞等提供任何形式的担保。开发者用户在使用Hermit开源代码时应自行判断和评估使用后果。开发者用户应仔细阅读并遵循相关开源软件协议（及我们不时作出的通知的要求。<br>
    五、风险提示<br>
    1.您了解并知悉，由于数字代币领域的法律法规政策尚未健全，该领域的数字代币可能会产生无法兑现、技术不稳定等重大风险。您也了解数字代币的价格波动幅度远高于其他金融资产。我们谨慎提醒您应当根据自身财务状况和风险偏好，以合理的方式选择持有或处置任何一种数字代币。您也了解Hermit提供的行情查看功能仅系抓取部分交易所的数字代币汇率信息的搜索结果，并不表示为最新行情或最佳报价。<br>
    2.在使用Hermit服务时，若您或您的相对方未遵从本《服务协议》或相关网站说明、交易、支付页面中之操作提示、规则，我们并不保证交易会顺利完成，且我们不承担损害赔偿责任。若发生前述情形，而款项已先行入账您的或您的交易方的Hermit钱包或第三方钱包，您理解区块链操作具有的“不可逆”属性，以及相关交易具有“不可撤销”的特征，由您及您的相对方自行承担相应的风险后果。<br>
    3.您理解并知悉，币币兑换交易均在第三方智能合约上发生、进行并完成。Hermit仅作为界面工具帮助您和第三方智能合约交互并显示该已完成交易的相应结果。<br>
    4.在您通过Hermit使用第三方服务时，我们强烈建议您仔细阅读该等第三方服务的服务协议、隐私政策和其他相关的文件和信息等，了解交易对象及产品信息，谨慎评估风险后再在该第三方上进行交易。您理解该交易和有约束力的合同关系在您和您的相对方之间建立，与我们无关。我们对因您的交易行为所引起的一切风险、责任、损失、费用不承担任何责任。<br>
    5.当您将数字代币转给其他钱包地址时，您在交易过程中应当自行判断对方是否为完全民事行为能力人并自行决定是否与对方进行交易或转账给对方等。<br>
    6.在转账过程中，如果出现“交易失败”、“打包超时”等类似的异常信息提示时，您应通过相关区块链系统的官方途径或其他的区块链查询工具进行再次确认，以避免重复转账；否则，由此所引起的一切损失和费用应由您自行承担。<br>
    7.您理解当您在Hermit上创建或导入钱包之后，您的Keystore、私钥、助记词等信息仅存储在当前的这台移动设备中，不存储在Hermit或我们的服务器上。您可以按照Hermit提供的操作指南采取同步钱包等方式更换移动设备。但若您未保存或备份钱包密码、私钥、助记词、Keystore等信息且在您移动设备丢失的情况下，您的数字代币将因此丢失，我们无法为您找回。若您在导出、保存或备份钱包密码、私钥、助记词、Keystore等信息的时候泄密，或保存或备份上述信息的设备或服务器被黑客攻击或控制等情况下，您的数字代币将因此丢失，我们无法为您找回。因前述情形产生的任何及所有损失应由您自行承担。<br>
    8.我们建议您在创建或导入钱包时对您钱包的钱包密码、私钥、助记词及Keystore等信息做好安全备份。我们提请您注意，请不要采用以下电子备份方式：截图、邮件、手机中的记事本应用、短信、微信、QQ等电子备份方式。我们建议您在纸质记事本上抄写助记词和Keystore等信息，同时您亦可将电子数据保管至密码管理器。<br>
    9.我们建议您在选购硬件钱包时应：<br>
    （1）确认您购买的硬件钱包是否与Hermit版本相匹配；<br>
    （2）从官方渠道选购全新的硬件钱包。<br>
    10.我们善意提醒您谨慎使用Hermit的免密支付功能，建议您在使用前应：<br>
    （1）仔细了解您手机设备生物识别的安全等级；<br>
    （2）请勿在公共手机中开启免密支付功能；及<br>
    （3）如果钱包中的数字资产较大，请勿开启免密支付功能。<br>
    11.我们建议您在安全的网络环境中使用Hermit，确保您的移动设备没有越狱或root， 以避免可能存在的安全隐患。<br>
    12.请您在使用Hermit过程中，警惕诈骗行为。一旦发现任何可疑行为，我们鼓励您第一时间告知我们。<br>
    六、服务的变更、中断、终止<br>
    1.您了解并同意我们可以自行决定暂时提供部分服务功能，或于将来暂停部分服务功能或开通新的服务功能。当我们改变服务时，只要您仍然使用Hermit，表示您仍然同意本《服务协议》或者本《服务协议》修正后的条款。<br>
    2.为了尽可能避免任何对Hermit的误操作或数字代币的任何安全风险，您应避免在不具备区块链基础知识的前提下使用Hermit。对不具备区块链基础知识的用户，我们有权拒绝提供部分或全部的服务功能。<br>
    3.您理解存在如下情形时，我们将暂停提供服务（或在发生如下情形时彻底终止服务）：<br>
    （1）因设备、区块链系统维修、升级、故障和通信中断等技术原因而中断Hermit的运营；<br>
    （2）因台风、地震、海啸、洪水、停电、战争或恐怖袭击等不可抗力因素，电脑病毒、木马、黑客攻击、系统不稳定或政府行为等原因，造成我们不能提供服务或我们合理认为继续提供服务会有较大风险的；<br>
    （3）适用法律或政策发生重大不利变化的；或<br>
    （4）发生我们无法控制或合理预见的其他情形。<br>
    4.当用户出现如下情况时，我们可单方面中止或终止您使用Hermit的部分或全部功能:<br>
    （1）用户死亡；<br>
    （2）盗用他人的钱包信息或移动设备；<br>
    （3）在Hermit填写虚假个人信息；<br>
    （4）拒绝Hermit的强制更新操作；<br>
    （5）违反第三方开源协议或我们通知的规定使用Hermit开源代码；<br>
    （6）将Hermit用于违法或犯罪活动；<br>
    （7）妨碍其他用户正常使用Hermit；<br>
    （8）伪称我们的工作人员或管理人员；<br>
    （9）攻击、侵入、更改或以任何其他方式威胁我们计算机系统的正常运作；<br>（10）利用Hermit宣传垃圾广告；<br>
    （11）散布谣言，损害我们和Hermit商誉；或<br>
    （12）违法行为，其他违反本《服务协议》的行为，及我们合理认为应当暂停功能的情形。<br>
    5.如果我们变更、中断、终止服务时，您有权在合理时间内导出您钱包等信息。<br>
    七、您的陈述与保证<br>
    1.您应遵守您所居住的国家或地区的法律法规，不得将Hermit用于任何非法目的，也不得以任何非法方式使用Hermit。<br>
    2.您不属于无资格使用Hermit服务的被排除人士。<br>
    3.您不得利用Hermit从事任何违法或犯罪的行为，包括但不限于：<br>
    （1）危害您所居住的国家或地区的国家安全、泄漏国家秘密、颠覆国家政权、破坏国家统一；<br>
    （2）从事任何违法犯罪行为，包括但不限于洗钱、非法集资等；<br>
    （3）通过使用任何自动化程序、软件、引擎、网络爬虫、网页分析工具、数据挖掘工具或类似工具等，接入我们的服务、收集或处理我们所提供的内容，干预或试图干预任何用户；<br>
    （4）提供赌博资讯或以任何方式引诱他人参与赌博；<br>
    （5）侵入他人Hermit钱包盗取数字代币；<br>
    （6）进行与交易对方宣称的交易内容不符的交易，或不真实的交易；<br>
    （7）从事任何侵害或可能侵害Hermit服务系统、数据的行为；<br>
    （8）其他我们有正当理由认为不适当的行为。<br>
    4.您理解并同意，您将对您违反有关法律（包括但不限于海关及/或税务方面的监管规定）或者本《服务协议》之规定的行为负责，并应对因此类违反、违约、违法而使我们遭受任何的损失、第三方索赔或行政处罚进行赔偿，包括合理的法律和行政成本、费用和支出，以及合理的律师费用。<br>
    5.您承诺按时缴纳我们的服务费用（如有），否则我们有权暂停对您提供的服务。
    八、隐私政策<br>
    1.您提供给我们的任何数据或信息亦受我们隐私政策（“《Hermit隐私政策》”的约束，该隐私政策亦是本《服务协议》的一部分。<br>
    九、免责及责任限制<br>
    1.我们仅对本《服务协议》中所列明的义务承担责任。<br>
    2.您理解和同意，在法律所允许的最大范围内，我们只能按照现有的技术水平和条件提供Hermit服务。因下列任何原因导致Hermit无法正常提供服务，我们不承担责任：<br>
    （1）Hermit系统停机维护或升级；<br>
    （2）因台风、地震、洪水、雷电或恐怖袭击等不可抗力原因；<br>
    （3）您的移动设备软硬件和通信线路、供电线路出现故障的；<br>
    （4）您操作不当或未通过我们授权或认可的方式使用我们服务的；<br>
    （5）因电脑病毒、木马、恶意程序攻击、网络拥堵、系统不稳定、系统或设备故障、通讯故障、电力故障、银行或政府行为等原因；<br>
    （6）非因我们的原因而引起的任何其它原因。<br>
    3.我们对以下任何情形均不承担责任：<br>
    （1）因您遗失移动设备、删除且未备份Hermit、删除且未备份钱包、遗忘且未备份钱包密码、私钥、助记词、Keystore而导致该用户的数字代币丢失；<br>
    （2）因您自行泄露钱包密码、私钥、助记词、Keystore，或借用、转让或授权他人使用自己的移动设备或Hermit钱包，或未通过我们官方渠道下载Hermit应用程序或以其他不安全的方式使用Hermit应用程序导致的您的数字代币丢失；<br>
    （3）因您误操作（包括但不限于您输错转账地址、您自身选择转账节点服务器的问题）Hermit导致的数字代币丢失；<br>
    （4）因您不理解区块链技术的知识而进行误操作导致的您的数字代币丢失；<br>
    （5）因系统滞后、区块链系统不稳定等原因导致我们拷贝用户在区块链上的交易记录发生偏差；<br>
    4.您应承担由下列情形产生或与之相关的风险和后果：<br>
    （1）您使用第三方服务操作的交易；<br>
    （2）您使用开发者模式；<br>
    （3）您使用币币兑换服务，该等风险和后果应由您、交易相对方和相关智能合约发行方承担。<br>
    5.您理解Hermit仅作为您数字代币管理的工具。我们不能控制第三方服务的质量、安全或合法性，信息的真实性或准确性，以及相对方履行其在与您签订的协议项下的各项义务的能力。您自行决定是否使用第三方服务。您理解该交易和有约束力的合同关系在您和您的相对方之间建立，与我们无关。我们提醒您在使用第三方服务前，应谨慎判断第三方服务所提供相关信息的真实性、合法性和有效性。此外，您与任何第三方交易所产生的全部风险亦应由您自行承担。<br>
    6.您知悉Hermit可能同时为您及您的交易对手方提供服务或与之有关联关系或其他利益相关的关系，您同意对我们可能存在的该等行为予以明确豁免任何实际或潜在的利益冲突，并不得以此来主张我们在提供服务时存在法律上的瑕疵，也不因此而加重我们的责任或注意义务。<br>
    7.我们不提供以下形式的保证：<br>
    （1）我们提供的服务将符合您的全部需求；<br>
    （2）您经由我们的服务取得的任何技术、产品、服务、资讯或其他材料将符合您的期望；<br>
    （3）我们从第三方交易所抓取的数字代币市场交易行情等信息的及时性、准确性、完整性、可靠性；<br>
    （4）您在Hermit上的交易对方会及时履行其在与您达成的交易协议中的各项义务。<br>
    8.在任何情况下，我们对本《服务协议》所承担的违约赔偿责任总额不超过1）0.1个以太币的市场价值；或2）新加坡元100元，以较高的为准。<br>
    9.您理解Hermit仅作为您管理数字代币、显示交易信息的工具，我们不提供法律、税务或投资建议等服务。您应当自行向法律、税务、投资方面的专业人士寻求建议，且您在使用我们服务过程中所遭受的投资损失、数据损失等，我们概不负责。<br>
    10.您理解根据适用法律法规的要求，我们可能不时更改我们的用户准入标准，限定向特定用户等提供服务的范围和方式等。<br>
    十、其他条款<br>
    1.不得转让。在符合本《服务协议》条款的情况下，只有您（而非其他人）有权向我们主张与使用服务相关的索赔。您不得转让、交易，或试图转让、交易您对该索赔的权利。任何该等转让行为均为无效，且我们对受让方不承担任何义务或责任。<br>
    2.知识产权。Hermit系我们开发并拥有知识产权的应用程序。Hermit中显示的任何内容（包括本《服务协议》、公告、文章、视频、音频、图片、档案、资讯、资料、商标或标识）的知识产权归我们或第三方权利人所有。您仅可为持有和管理数字代币之目的使用Hermit应用程序及其中的内容。未经我们或第三方权利人的事先书面同意（或相关开源协议的允许），任何人不得擅自使用、修改、反向编译、复制、公开传播、改变、散布、发行或公开发表上述应用程序及内容（包括Hermit开源代码）。本《服务协议》不应被视为授予您任何知识产权，包括出于任何目的使用与我们或服务相关的任何信息、图片、用户界面、标识、商标、商业名称、网络域名或版权的权利。<br>
    3.非弃权。任何我们未执行本《服务协议》或未向您主张我们在本《服务协议》项下的权利、索赔或诉因的行为均不被视为放弃我们向您主张任何权利、索赔或诉因的权利。<br>
    4.完整协议：<br>
    （1）本《服务协议》由《Hermit服务协议》、《Hermit隐私政策》及我们不时公布的各项规则（包括“帮助中心”的内容）组成。<br>
    （2）除了本《服务协议》中的《Hermit服务协议》、《Hermit隐私政策》外，本《服务协议》包含我们之间关于使用Hermit和相关服务的全部协议和谅解，并取代所有先前的（口头的和书面的）协议、谅解或安排。<br>
    5.税款：<br>
    （1）使用本《服务协议》下的服务不含您在任何法域就您使用本服务所适用、产生、有关的税款（“应纳税款”）。<br>
    （2）您应负责确定任何应纳税款，并向合适的税务机关申报、代扣、收集、报告和代缴正确的应纳税款。您应自行承担因未完成或未履行您的任何与应纳税款相关的义务而产生的所有处罚、索赔、罚款、惩罚和其他责任。<br>
    （3）我们不负责确定任何应纳税款，亦不负责向合适的税务机关申报、代扣、收集、报告和代缴正确的应纳税款。<br>
    6.法律适用。本《服务协议》适用新加坡共和国法律，并应据此解释。<br>
    7.管辖权。因本《服务协议》引起的或与之相关的任何争议（包括任何有关其存在、有效性、终止的问题），双方应首先寻求和解。如果该争议在该和解程序开始后的三十(30)天内仍未解决，双方应将该争议提交至新加坡国际仲裁中心（简称“SIAC”），并通过遵循新加坡国际仲裁中心届时有效的仲裁规则（该规则被视为通过引用并入本条款），最终以仲裁的方式在新加坡予以解决。仲裁庭由一名仲裁员组成，由SIAC主席任命。仲裁语言为英语。每一方不可撤销地接受新加坡法院之非专属管辖权，以支持和协助根据本段前述内容进行的仲裁程序，包括在该程序的结果作出之前给予临时救济（如必要）。<br>
    8.《合同（第三方权利）法》。新加坡共和国的《合同（第三方权利）法》（第53B章）（可能不时被修改、修订或补充）应适用于本《服务协议》。非本《服务协议》一方的人士不得拥有本《服务协议》项下的任何权利，也无权执行本《服务协议》。<br>
    9.独立性。本《服务协议》的任何部分被任何约束本《服务协议》的立法认为无效、非法或不可执行时，其仅在该范围（且不得进一步扩展）内被视为无效、非法或不可执行。为避免疑问，本《服务协议》的剩余部分将继续有效并保持充分的效力。<br>
    10.部分无效。根据任何司法管辖区的法律，本《服务协议》任何条款被认定为非法、无效或不可执行的情形不得影响该条款依据其他司法管辖区的法律被认定为合法、有效或可执行，亦不得影响本《服务协议》其他条款的合法性、有效性或可执行性。<br>
    11.本《服务协议》译本。本《服务协议》的任何译本（如有）仅为方便您而提供，无意对本《服务协议》的英文版本进行修改。如果本《服务协议》的英文版本与非英文版本之间存在冲突，应以英文版本为准。<br>
    十一、其它<br>
    1.您应当全面了解并遵守您所在司法辖区与使用服务所有相关法律、法规及规则。<br>
    2.您在使用服务过程中，如遇到任何问题，您可以通过在Hermit提交反馈等方式联系我们。<br>
    3.所有的用户可以在Hermit中查看本《服务协议》。我们鼓励您在每次访问Hermit时都查阅本《服务协议》。<br>
    4.本《服务协议》未尽事宜，您需遵守我们不时更新的公告及相关规则。<br>
    5.本《服务协议》自2022年9月3日起生效。<br>
    <br>
    本政策未尽事宜，您需遵守本站不时更新的公告及相关规则。
    `
  },
  'CT': {
    myDelegate: '我的委托',
    verifiedBy:'驗證人'
  },
  'EN': {
    text01: 'Create wallet',
    text02: 'No wallet',
    text03: 'Import Wallet',
    text04: 'Already have a wallet.',
    text05: 'i have read carefully and agree with《user agreement》',
    text06: 'create wallet',
    text07: 'wallet name',
    text08: 'please input wallet name in1~10 characters',
    text09: 'password',
    text10: 'password is not less than 8 digits',
    text11: 'repeat password',
    text12: 'create wallet',
    text13: 'the two password is different，please try again',
    text14: 'backup memorizing words',
    text15: 'security tips',
    text16: 'Hermit wallet will not save your wallet mnemonics for you. Please back up and keep them yourself.To obtain mnemonics, you own assets. For security, please do not take screenshots or save mnemonics online.',
    text17: 'Backup wallet',
    text18: 'Please back up mnemonics in order to ensure that the backup is correct.',
    text19: 'Backup Completed',
    text20: 'Verify the mnemonic',
    text21: 'Please select the backup mnemonics in order.',
    text22: 'Confirm',
    text23: 'Error prompt: mnemonic error, please reconfirm!',
    text24: 'Wallet created successfully',
    text25: 'Mnemonic words',
    text26: 'It consists of words separated by spaces.',
    text27: 'Private key',
    text28: 'public key',
    text29: 'keystore',
    text30: 'Encrypted private key JSON',
    text31: 'Mnemonic import',
    text32: 'Mnemonic (filled apart)',
    text33: 'Enter mnemonic words separated by spaces',
    text34: 'Wallet password',
    text35: 'Set a wallet password (not less than 8 digits)',
    text36: 'Repeat to confirm Wallet password',
    text37: 'wallet name',
    text38: 'Set Wallet Name',
    text39: 'import',
    text40: 'Mnemonic error prompt: It is an invalid mnemonic, please check it!',
    text41: 'Mnemonic error prompt: mnemonic error, please check it!',
    text42: 'Incorrect password: The password is inconsistent, please enter it again!',
    text43: 'Success Tip: Imported successfully!',
    text44: 'import private key ',
    text45: 'wallet password',
    text46: 'Set a wallet password (not less than 8 digits)',
    text47: 'Repeat to confirm Wallet password',
    text48: 'wallet name',
    text49: 'Set Wallet Name',
    text50: 'Private key error: Please enter a valid private key',
    text51: 'Incorrect password: The password is inconsistent, please enter it again!',
    text52: 'Success Tip: Imported successfully!',
    text53: 'import keystore',
    text54: 'Enter keystore file contents',
    text55: 'wallet password',
    text56: 'Enter the original corresponding wallet password of keystore',
    text57: 'please input wallet name',
    text58: 'Import',
    text59: 'Keysore error prompt: incorrect keysore content, please check!',
    text60: 'Wallet password error prompt: the original corresponding wallet password of keysore is wrong, please confirm!',
    text61: 'Success Tip: Imported successfully!',
    text62: 'Select import type',
    text63: 'Keystore can not be empty!',
    text64: 'Wallet password can not be empty',
    text65: 'Wallet name cannot be empty!',
    text66: 'Create your Wallet',
    text67: 'Protect your assets',
    text68: 'User agreement',
    text69: 'Acquiring mnemonic words is equivalent to owning the wallet assets',
    text70: 'Next',
    text71: 'Do not take screenshots.',
    text72: 'Enter the plaintext private key',
    text73: 'Please write the mnemonic down in order to ensure the backup is correct.',
    text74: 'Keep the mnemonic phrase in a safe place isolated from the network.',
    text75: 'Do not share and store mnemonic phrases in a networked environment, such as emails, photo albums, social applications, etc.',
    text76: 'Set wallet name',
    text77: 'The mnemonic is composed of English words, please copy and keep it properly.',
    text78: 'If the mnemonic is lost and cannot be retrieved, be sure to back up the mnemonic.',
    text79: 'Wallet password cannot be empty!',
    text80: 'password is not less than 8 digits',
    text81: 'Private key cannot be empty!',
    text82: 'Import',
    text83: 'Enter the original corresponding fund password of Keystore',
    text84: 'The password input is inconsistent, please re-enter',
    text85: 'Wallet name cannot exceed 10 characters',
    text86: 'Wallet already exists, please do not import the same wallet',
    text87: `Hermit Matrix Network (hereinafter referred to as "me" or "us") is a geek development organization specializing in blockchain software, dedicated to providing trusted digital asset management services for individuals like you ("you" or "your") using decentralized technology. We host a top-level domain: https://Hermit.ink, which provides information about Hermit and our products, as well as sub-domain ("Website") information about our products, including text, images, audio, code and other materials or third-party information.<br>
As more and more scammers try to trick unsuspecting victims of digital assets, verify your SSL certificate every time you visit our domain name. Make sure the SSL certificate is authentic before downloading, clicking on, or otherwise interacting with it from the website you are visiting. For the avoidance of doubt, we have no control or liability over the content, privacy policy or conduct of any third party website or service. We shall not be liable or liable, directly or indirectly, for any damage or loss caused or claimed by the use of, or reliance on, any such content, goods or services on or through such websites or services.<br>
This Service Agreement ("Agreement" or "Service Agreement") contains the terms and conditions governing your access to and use of the Website and Services we provide (as defined below) and is an agreement between us and you or the entity you represent. Please read the Service Agreement carefully before using this site or service. By using the Site, or by clicking a button or check box to accept or agree to the Terms of Service (if any) of this Service Agreement, or by filling out a Service Order, or, if earlier, by using or otherwise accessing the Service (Effective Date), you (1) accept and agree to this Service Agreement and any additional terms, rules and conditions of participation that we may from time to time issue, and (2) agree to the collection, use, disclosure and other processing of information as described in our Privacy Policy. If you do not agree to this Service Agreement, you may not access or use the Services.<br>
In particular, we remind you to read this Service Agreement and other documents referred to in this Service Agreement carefully, in particular the Disclaimer and Limitation of Liability clause in this Service Agreement, before using our Hermit Mobile Application (hereinafter referred to as "Hermit" or "this Software", which Hermit can download from any mobile application platform, including but not limited to Google Play Store and Apple App Store), to ensure that you fully understand the terms of this Service Agreement and consider the risks of using Hermit.<br>
I. Confirmation and Acceptance of this Service Agreement<br>
1. You understand that this Service Agreement and related agreements apply to our proprietary and decentralized applications ("DApp") developed and owned by Hermit and Hermit (excluding DApp developed by third parties).<br>
2. By downloading the Hermit software and creating, restoring, or importing into your wallet, you shall be deemed to have fully read and accepted all the terms of this Service Agreement, which shall take effect immediately and be binding on both Parties. If you do not agree to the terms of this Service Agreement, you must immediately stop using Hermit. If you have downloaded Hermit, delete it now.<br>
3. In accessing or using Hermit, you agree to:<br>
(1) To be bound by the latest version of this Service Agreement (without change or modification);<br>
(2) Within your jurisdiction, you have attained the legal age for the use of Hermit and may assume binding legal or pecuniary obligations arising out of the use of Hermit;<br>
(3) You are not an excluded person (as defined below).<br>
4. This Service Agreement may be updated by us from time to time, and as soon as the amended Service Agreement is published on our website, it shall take effect automatically without further notice. If you do not accept the amended terms after we publish them, please discontinue Hermit immediately.<br>
5. Draw your attention to the fact that your use of Hermit after any such modification of this Terms of Service indicates your acceptance of these modified Terms of Service.<br>
II、 Definitions<br>
1. China means the People's Republic of China, including (1) Hong Kong Special Administrative Region, (2) Macao Special Administrative Region and (3) Taiwan Region.<br>
2. Hermit: A multi-currency digital wallet developed by us based on distributed accounting technology, including other tools developed to facilitate your use of the blockchain system.<br>
3. Excluded persons:<br>
(1) persons other than natural persons who have the legal and conscious capacity to enter into this Service Agreement; or<br>
(2) Persons prohibited, restricted, unauthorized or unentitled to use the Services (as defined in this Service Agreement) in any form or manner (in whole or in part) by virtue of this Service Agreement, laws, regulatory requirements or provisions applicable to the User's jurisdiction.<br>
(3) For the avoidance of doubt, residents residing in China and/or users residing in China are also included in the definition of "excluded persons".<br>
We do not provide services to the excluded. If you are excluded, please stop using our service immediately. If you continue to use our services, you acknowledge and agree that you will bear all corresponding liability in accordance with the applicable laws, regulations and provisions of the jurisdiction in which you reside, and that you will exempt us from any liability arising from such use by you, including but not limited to, damages, third party claims or administrative penalties, and reasonable legal and administrative costs, costs and expenses, including reasonable attorney's fees, arising from such violations, breaches, violations, and administrative penalties.
4. Identity: refers to the digital identification based on your public-private key pair.<br>
Beginner's Guide: Before you use Hermit (and during future use), we provide you with a Hermit Guide to help you understand the basics of blockchain.<br>
6. Creation or import of wallets: refers to the process of creating or importing wallets using Hermit after you have accepted this Service Agreement.<br>
7. Wallet Password: The password that you decide to use to encrypt and protect your private key during the creation of your Hermit Wallet. As a decentralized application, Hermit does not store wallet passwords on your mobile device or our servers. Once you lose or forget your wallet password, you need to reset it with a private key or mnemonic.<br>
8. Information prompt: the information prompt content involved in the operating interface of the Hermit software is recommended to be operated according to the relevant steps.<br>
9. Specific users refer to users who are required by laws, regulations and policies of Singapore and other countries to cooperate with us in performing the obligation of personal information disclosure.<br>
10. Developer user: refers to the user who uses Hermit open source code, developer mode and other services provided to developers in accordance with our notification and relevant open source agreements.<br>
11. Private key: It consists of 256 random characters and is the core of digital tokens owned and used by users.<br>
12. Public Key: The private key is generated by a one-way derivation based on cryptographic principles and used to generate the block chain digital wallet address, which is the public collection address.<br>
13. Mnemonics: 12 ordered words (or 15/18/21/24) generated by stochastic algorithms, conforming to blockchain BIP39 industry standards. Private key is easy to record the manifestation of the convenience of your backup custody.<br>
14. Keystore: is a private key or mnemonic saved as a file encrypted by your wallet password, stored only on your mobile device and not synchronized to our server.<br>
15. Digital tokens: refer to the types of digital tokens currently supported by Hermit, including but not limited to BTC, ETH, etc.<br>
16. Materials: refer to the materials such as articles in the sections of "browse" and "market" on Hermit, which are owned by a third party and shall not be reproduced without authorization. This information is for your reference only and does not constitute our guidance or advice on your transactions.<br>
17. Message center: An inbox where you can receive messages or notifications from us.<br>
18. Personal information refers to all kinds of information recorded by electronic or other means that can be used separately or in combination with other information to identify a user's personal identity, including but not limited to personal biometric information, email address, wallet address, mobile device information, operation records, transaction records, etc., but does not include a user's wallet password, private key, mnemonic, or Keystore.<br>
19. "Intelligent contract" refers to an intelligent contract based on Ethernet for the purpose of disseminating, validating or performing contracts in an information-based manner, including but not limited to the Tokenlon Intelligent contract mentioned later.<br>
20. WETH: refers to the tokenization of ether coins, because ether coins do not meet their own ERC20 standards, packaging for ether coins tokenization, to facilitate the direct trading of ether coins with other tokens. The exchange rate between tokens supported by Hermit and WETH is determined by a third-party smart contract.<br>
21. ETH: refers to Ether coins, which are encrypted digital tokens related to Ethereal block chains, excluding the "Ethereal Classic" for the avoidance of doubt.<br>
22. Hermit open source code ("Hermit OSC"): refers to the part of Hermit software code that we have publicly announced as open source, allowing developers to use (including secondary development) this part of open source code subject to the provisions of the relevant open source agreements and our notifications.<br>
23. Open source agreement: refers to the third-party Open source agreement that developers and users should follow when using Hermit open source code.<br>
24. Third-party services: refer to the products and services provided by third parties such as third-party DApp, third-party intelligent contracts, third-party open source agreements, third-party hardware wallets, third-party web pages, third-party exchanges, etc.<br>
III、 Hermit Services (collectively referred to as "Services")<br>
1. Creation and restoration of identity. You can create and restore identities using the "Create identity" and "Restore identity" buttons provided by Hermit, and manage multiple wallets under one identity.<br>
2. Import wallets. For Hermit -supported digital tokens, you can use Hermit to generate new wallets or compatible wallets from other wallet tools imported into the relevant blockchain system.<br>
3. Transfer and collection. You can use Hermit's transfer, collection functions for digital token management, that is, the use of private keys for electronic signature, the relevant block chain of books to modify. Transfer refers to that the payer uses the ENS domain name or blockchain address of the payee to make the transfer, which involves the effective recording of the transaction in the distributed books of the relevant blockchain system (rather than the actual delivery or transfer of digital tokens on Hermit).<br>
4. Market review. You can use Hermit to view the exchange rates of digital tokens provided by third parties. Hermit grabs information about the exchange rate of digital tokens and displays it in the “market” section of Hermit.<br>
5. Managing digital tokens. You can add, store, or remove Hermit -supported digital tokens (except ETH, BTC) from the Hermit interface.<br>
6. Currency exchange (DEX). You can exchange digital tokens with a third party using a third party Hermit smart contract. Hermit acts as an interface tool to help you interact with the third party smart contract and display the results of the digital tokens exchange.<br>
7. Browse DApp. You access and use the services provided by this DApp (including our own DApp and third-party DApp) through Hermit.<br>
8. Search for DApp. You can search the DApp listed in Hermit through Hermit's search box.<br>
9. Integrated hardware wallet. You can use the appropriate version of Hermit to match a particular hardware wallet and use the hardware wallet to confirm transactions made through Hermit.<br>
10. Exemption from secret payment. You can use the Secret Free Payment feature in Hermit to store user wallet passwords through a secure encryption algorithm in the Keychain/Keystore on your mobile device, and invoke your biometric (fingerprint or face) authentication during the transaction to quickly complete the payment and signature.<br>
11. Developer model. In developer mode, developers can type in URLs to access any other site and third party DApp not integrated with Hermit.<br>
12. Transaction records. We will copy all or part of your transactions through the blockchain system. However, you should base your transaction on the latest block chain system transactions.<br>
13. Suspension of services. You understand that, based on the "irrevocable" nature of blockchain transactions, we cannot revoke or undo transactions for you, but under certain circumstances we can suspend or restrict a user's access to Hermit software.<br>
14. Other services we deem necessary to provide.<br>
Understand and accept when users use Hermit:<br>
1. Adhering to the decentralized characteristics of blockchain, and in order to protect the security of your digital tokens, we provide decentralized services, which are significantly different from banking financial institutions. You understand and accept that we do not assume the following responsibilities:<br>
(1) Store your wallet password (that is, the password you set when you created/imported your wallet), private key, mnemonic or keystore;<br>
(2) Retrieve your wallet password, private key, mnemonic or keystore;<br>
(3) Freezing wallets;<br>
(4) Reporting the loss of wallet;<br>
(5) Recovering the wallet; or<br>
(6) Trading rollback.<br>
2. You are responsible for keeping the mobile device containing Hermit, backing up Hermit, backing up the wallet password, mnemonics, private key and Keystore. If you have lost your mobile device, deleted and failed to back up Hermit, deleted and failed to back up your wallet, stolen or forgotten your wallet password, private key, mnemonic, or keystore, we will not be able to recover your wallet or retrieve your wallet password, private key, mnemonic, or keystore; we will not be able to cancel the transaction if the user misbehaves in the transaction (such as inputting the wrong transfer address, inputting the wrong exchange amount), and we will not be held responsible for this.<br>
3. If you use Hermit's secret free payment function, please backup your wallet password properly. You will need to enter your wallet password after your fingerprint or face recognition failed multiple times. If you forget your wallet password, you need to set the new wallet password by importing the mnemonic/private key. We do not store your fingerprints, face recognition and other biological information, and we are not responsible for this.<br>
4. The digital token management services that Hermit can provide do not include all existing digital tokens, please do not operate any digital tokens that Hermit does not support through Hermit.<br>
5. DApp integration on Hermit includes our own DApp and DApp from third-party platforms. For DApp provided by third-party platforms, Hermit only provides search and blockchain browsers for users to access DApp, and does not provide any guarantee of third-party DApp functionality or quality of service. You should judge and evaluate the risks of the services or transactions provided by the third-party DApp before accepting the services or making transactions on the third-party DApp.<br>
6. The essence of the currency exchange function provided on Hermit is the exchange of digital coins on the blockchain system using third-party smart contracts. For services provided under third party smart contracts, Hermit only provides you with tools for interacting with third party smart contracts, and does not provide any guarantee for the function or quality of service of third party smart contracts. You shall, before accepting or transacting the service or transaction under the third party intelligent contract, judge and assess whether there is any risk in the service or transaction provided by the third party intelligent contract. We strongly recommend that you read the updated User Agreement and/or Disclaimer for the Smart Contract. We reserve the right to immediately terminate or suspend access to these third party services for any reason without notice or responsibility.<br>
7. Hardware wallets integrated on Hermit are provided by third parties, Hermit does not provide any warranty on the functionality or quality of service of third party Hardware wallets, and Hermit does not guarantee the implementation of matching functionality with any type or version of Hardware wallets (subject to our notice from time to time). Before using a third-party hardware wallet, the user should judge and evaluate whether the hardware wallet is at risk. You should carefully read and agree to relevant hardware wallet constantly updated license agreements and other documents.<br>
8. If you use the developer mode on Hermit to access other websites or a third party DApps not integrated on Hermit by entering a URL, you are aware of and agree that you understand the URL-linked website and the potential security risks of the third party DApps and bear all risks and consequences independently.
IV、 Your Rights and Obligations<br>
1. Create or import wallets<br>
1. Create or import wallets. You have the right to create and/or import wallets through Hermit on your mobile device, to set information such as the wallet password for the wallet, and to use your wallet to make transfers and receipts on the blockchain through the Hermit application.<br>
2. Authentication. Pursuant to the requirements of the relevant laws and regulations, when using the relevant services provided by Hermit, specific users shall promptly complete the relevant authentication in accordance with the prompts of Hermit, and be required to submit personal information such as your name, identity card number, mobile phone number, bank card number, etc. Otherwise, the specific user will not be able to use the services, due to specific user delays caused by the loss of your own.<br>
3. We may develop different versions of the software for different terminal devices, and you should download the appropriate version according to your actual needs. If you have never obtained this software or the installer with the same name as this software from a legally authorized third party, we will not be able to guarantee the normal use of this software, nor will we be able to guarantee its safety, so you will be responsible for the losses caused.<br>
4. After the new version of this software is released, the old version may not be used. We do not guarantee the security, continued availability or customer service of older software. Please check and download the latest version at any time.<br>
(II) Use of Hermit<br>
1. You shall be responsible for properly keeping the information such as mobile devices, wallet passwords, private keys, mnemonics and keystores. We are not responsible for keeping the above information for you. All risks, liabilities, losses and expenses arising from the loss of your mobile device or hardware wallet, active or passive disclosure, forgetting of your wallet password, private key, mnemonic, Keystore or being attacked or defrauded by others shall be borne by you.<br>
2. Hermit information prompt. You understand and agree to follow the information prompts we have published on Hermit and act on them, otherwise you will be responsible for all risks, liabilities, losses, expenses, etc.<br>
3. You are aware and understand that Hermit is not obligated to perform due diligence obligations with respect to third-party services and that you should carefully assess and assume all risks associated with the use of Hermit.<br>
4. Provision of information and documentation. If we deem it necessary to obtain information from the User in order to comply with any applicable laws or regulations relating to the use or operation of Hermit, you shall promptly provide us with such information in accordance with our requirements, and you understand and accept that, we may limit, suspend or terminate your use of Hermit until you provide information that meets our requirements. You undertake to promptly inform us of any changes in the documents and information provided by you to us in accordance with this Service Agreement, and without written notice of any changes, we have the right to consider the contents of the documents and information provided by you to be true, correct, unmisleading and unchanged.<br>
5. Complete the authentication. When we reasonably believe that there is an abnormality in your trading behavior or trading conditions, or that there is any doubt about your identity information, or we believe that it is necessary to check your identity certificate or other necessary documents, please actively cooperate with us in checking your valid identity certificate or other necessary documents, and complete the relevant identity verification in a timely manner.<br>
6. Transfer.<br>
(1) You are aware of the limit and number of daily transfers available to you in the Hermit service, which may vary depending on the country/region, regulatory requirements, purpose of the transfer, Hermit risk control, authentication, etc., in which you use the transfer service.<br>
(2) You understand the "irrevocable" nature of blockchain -based operations and that when you use the Hermit transfer function, you are responsible for the consequences of your mistakes (including but not limited to the problem of entering the wrong transfer address and choosing your own transfer node server).<br>
(3) You are aware that, when using Hermit Services, the following circumstances may result in unavailability of the transfer function, "transaction failure" or "packaging timeout":<br>
A) Insufficient wallet balance;<br>
B) Miners' fees for transactions are insufficient;<br>
C) Block chain failed to execute intelligent contract code;<br>
D) The amount of payment exceeds the amount prescribed by the regulatory authorities, Hermit or laws and regulations;<br>
E) Network, equipment and other technical failures;<br>
F) Trading is abandoned due to block chain network congestion, failure or other reasons;<br>
G) Your address or the address of the counterparty is identified as a special address, such as a high-risk address.<br>
(4) You are aware that Hermit only provides you with a transfer facility, and that after you have completed the transfer using Hermit, we have fulfilled all obligations of the current service and are not liable for any other disputes.<br>
7. Currency exchange. You are aware that the daily limit for currency exchange is currently set by a third party Smart Contract. We may also limit and adjust your daily currency limits from time to time.<br>
8. Legal compliance. You are aware that when operating at Hermit or trading with DApp, Smart Contracts on Hermit, you should comply with relevant laws, regulations, and national policies.<br>
9. Announcement. Hermit will notify you in the form of website announcements, message center information, pop-ups, or client notifications, for example, to inform you of the progress of your transactions, or to prompt you to take appropriate action. Please follow up.<br>
10. Service fees and tax payment obligations:<br>
(1) When you use Hermit's currency exchange service, the third party Smart Contract will charge you a service fee and/or service fee, the specific fee shall be the amount charged for the third party Smart Contract, and Hermit information tips are for reference only;<br>
(2) We do not charge you any form of service fee or handling fee for the time being, and we will otherwise agree or publish the rules when we need to charge for certain services in the future;<br>
(3) You shall pay "Miner's Fees" or Network Fees when using Hermit for transfer, the amount of which is at your discretion and collected by the relevant block chain network;<br>
(4) You are aware that your transfer operation may fail under certain circumstances (including but not limited to "miner's fees" or insufficient network fees paid for the transfer during your transfer, or the instability of the relevant blockchain network); in such circumstances, you may be charged by the relevant blockchain network for the miner's fees even if your transfer operation is not completed;<br>
(5) You are responsible for all taxable and other expenses incurred in connection with your transaction with Hermit.<br>
(III) Developer user development based on Hermit open source<br>
1. Developer users have the right to redevelop the application using the Hermit open source code we advertise in the official channel, and download and use any patches or vulnerability solutions we release for Hermit open source code.<br>
2. When using Hermit open source code, the developer user knows and agrees that:<br>
(1) If developer users find any bugs, defects or software improvement schemes in the process of using Hermit open source code, they shall contact and inform us in a timely manner, and stop any harmful use (if applicable);<br>
(2) Hermit open-source code may contain third-party open-source agreements and source code, and we do not provide any form of guarantee for the functions, virus-free, loop-free, etc., of such third-party open-source agreements and source code. Developers should judge and evaluate the consequences of using Hermit open source. Developer users should carefully read and follow the requirements of the relevant Open Source Software Agreements (and the notifications we give from time to time).<br>
V、 Risk Warning<br>
1. You are aware that, as the laws, regulations and policies in the field of digital tokens are not yet sound, the digital tokens in this field may cause major risks such as uncashable and unstable technologies. You also know that digital tokens are much more volatile than other financial assets. We caution that you should choose to hold or dispose of any digital token in a reasonable manner based on your financial position and risk preference. You also know that Hermit's Quotes View is only a search result for exchange rates for some exchanges, and does not represent the latest quotes or best offers.<br>
2. In using Hermit Services, we do not guarantee that the Fair will be successfully completed and we will not be liable for damages if you or your counterparties do not comply with the Notes, Notes, and Rules in this Service Agreement or the relevant Web Site Notes, Transactions, and Payment Pages. If any of the aforesaid circumstances occurs, and the money has been first credited to your Hermit Wallet or to a third party's Wallet, you understand that the blockchain operation has the attribute of "irreversibility" and the relevant transaction has the characteristic of "irrevocability", and you and your counterpart shall bear the corresponding risks and consequences on your own.<br>
3. You understand and are aware that currency exchange transactions take place, take place and are completed under third-party smart contracts. Hermit serves only as an interface tool to help you interact with third-party smart contracts and display the results of the completed transaction.<be>
4. When using third-party services through Hermit, we strongly recommend that you carefully read the service agreements, privacy policies and other relevant documents and information of such third-party services, understand the transaction objects and product information, and carefully assess the risks before trading on such third-party services. You understand that the transaction and the binding contractual relationship are established between you and your counterpart and are not ours. We are not liable for any risks, liabilities, losses or expenses arising from your trading.<br>
5. When you transfer your digital tokens to other wallet addresses, you shall, in the course of trading, determine on your own whether the other party is a person with full capacity for civil conduct and whether to trade with the other party or transfer the money to the other party.<br>
6. In the process of transfer of funds, if there are reminders of "transaction failure", "timeout of packing" or other similar abnormal information, you shall confirm again through the official channel of the relevant block chain system or other block chain query tools to avoid repeated transfer of funds; otherwise, you shall bear all losses and expenses arising therefrom.<br>
7. You understand that after you create or import a wallet on Hermit, your keystore, private key, mnemonic, and other information is stored only on the current mobile device and not on Hermit or our servers. Follow the instructions provided by Hermit to replace your mobile device with a synchronous wallet. However, if you do not save or back up your wallet password, private key, mnemonic, keystore, and other information and if your mobile device is lost, your digital tokens will be lost and we cannot retrieve them for you. If you divulge information such as your wallet password, private key, mnemonic, or keystore when you export, save, or back up your wallet password, private key, mnemonic, or if the device or server that saved or backed up that information is hacked or controlled, your digital tokens will be lost and we cannot retrieve them for you. Any and all losses arising from the foregoing shall be borne by you.<br>
8. We recommend that you make a secure backup of your wallet's password, private key, mnemonic and keystore information when you create or import your wallet. We call your attention, please do not use the following electronic backup methods: screenshots, mail, mobile phone notepad app, SMS, WeChat, QQ and other electronic backup methods. We recommend that you copy mnemonic and keystore information on your paper notepad, and that you also keep your electronic data in the password manager.
9. We recommend that you purchase your hardware wallet by:<br>
(1) Confirm whether the hardware wallet you purchased matches the Hermit version;<br>
(2) Purchasing new hardware wallets from official sources.<br>
10. We warn you in good faith to be careful about using Hermit's secret free payment feature and recommend that you:<br>
(1) Carefully understand the security level of biometric identification of your mobile phone equipment;<br>
(2) Please do not turn on the secret free payment function in public mobile phones; and<br>
(3) If the digital assets in the wallet are relatively large, please do not turn on the secret free payment function.<br>
11. We recommend that you use Hermit in a secure network environment to ensure that your mobile device is not jailbroken or rooted to avoid possible security risks.<br>
12. Please watch out for fraud when using Hermit. We encourage you to notify us of any suspicious activity as soon as possible.<br>
VI、 Alteration, Interruption and Termination of Services<br>
1. You understand and agree that we may, at our own discretion, temporarily provide some services or suspend some services or launch new services in the future. When we change the Services, as long as you still use Hermit, you still agree to this Service Agreement or the amended terms of this Service Agreement.<br>
2. To avoid, as far as possible, any mishandling of Hermit or any security risks to digital tokens, you should avoid using Hermit without a basic knowledge of blockchain. We have the right to withhold some or all of our services from users who do not have the basics of blockchain.<br>
3. You understand that under any of the following circumstances, we will suspend the provision of services (or completely terminate the services if:<br>
(1) interruption of Hermit operations due to technical reasons such as maintenance, upgrades, malfunctions and communication interruptions of equipment and blockchain systems;<br>
(2) Due to force majeure factors such as typhoon, earthquake, tsunami, flood, power outage, war or terrorist attack, etc., computer virus, Trojan horse, hacker attack, system instability or government behavior, etc., we cannot provide services or we reasonably believe that there will be great risks in continuing to provide services;<br>
(3) significant adverse changes in the applicable laws or policies; <br>
(4) Other circumstances beyond our control or reasonable forecast.<br>
4. We may unilaterally suspend or terminate your use of some or all of Hermit's features if:<br>
(1) The user dies;<br>
(2) embezzling others' wallet information or mobile devices;<br>
(3) Filling in false personal information at Hermit;<br>
(4) Refusing Hermit's mandatory update operation;<br>
(5) using Hermit open source code in violation of the provisions of the third party open source agreement or our notification;<br>
(6) Hermit is used for illegal or criminal purposes;<br>
(7) Hindering the normal use of Hermit by other users;<br>
(8) Pretending to be our staff or managers;<br>
(9) to attack, invade, modify or in any other way threaten the normal operation of our computer systems;<br>
(10) using Hermit to advertise junk;<br>
(11) Spreading rumors to the detriment of our and Hermit goodwill; or<br>
(12) Illegal acts, other acts in violation of this Service Agreement, and circumstances where we reasonably consider that the functions shall be suspended.<br>
5. You have the right to export your wallet and other information within a reasonable time if we change, interrupt or terminate the service.<br>
VII、 Your Statement and Warranty<br>
1. You shall abide by the laws and regulations of the country or region in which you reside and shall not use Hermit for any unlawful purposes or in any unlawful manner.<br>
2. You are not an excluded person who is not eligible to use Hermit Services.<br>
3. You shall not use Hermit for any illegal or criminal purpose, including but not limited to:<br>
(1) endanger the national security of the country or region where you live, divulge state secrets, subvert state power, or undermine national unity;<br>
(2) engaging in any illegal or criminal activities, including but not limited to money laundering and illegal fund-raising;<br>
(3) access to our services, collect or process our content, interfere with or attempt to interfere with any user by using any automated program, software, engine, web crawler, web analysis tool, data mining tool or similar tool;<br>
(4) Providing gambling information or inducing others to participate in gambling by any means;<br>
(5) Hacking into the wallet of Hermit to steal digital tokens;<br>
(6) Carrying out any transaction that is inconsistent with the transaction contents declared by the counterparty, or any transaction that is untrue;<br>
(7) engage in any act that infringes or may infringe upon the Hermit service system or data;<br>
(8) Other acts that we have justified reasons to consider inappropriate.<br>
4. You understand and agree that you will be liable for any breach of applicable laws (including, but not limited to, customs and/or tax regulations) or of this Service Agreement by you and will be liable for any damages, third party claims or administrative penalties suffered by us as a result of such violation, breach of contract, or breach, including reasonable legal and administrative costs, expenses and expenses, and reasonable attorney fees.<br>
5. You undertake to pay our service fees on time (if any), otherwise we have the right to suspend the services provided to you.<br>
VIII、 Privacy Policy<br>
1. Any data or information you provide to us is also governed by our Privacy Policy (Hermit Privacy Policy), which is also part of this Service Agreement.<br>
IX、 Disclaimer and Limitation of Liability<br>
1. We are only liable for the obligations set out in this Service Agreement.<br>
2. You understand and agree that to the maximum extent permitted by law, we can only provide Hermit services in accordance with existing technical standards and conditions. We are not responsible for any of the following reasons that prevent Hermit from providing services normally:<br>
(1) Downtime maintenance or upgrade of the Hermit system;<br>
(2) Due to typhoon, earthquake, flood, lightning, terrorist attack or other force majeure;<br>
(3) The software and hardware of your mobile equipment and the communication lines and power supply lines are faulty;<br>
(4) You use our services improperly or without our authorization or approval;<br>
(5) Due to computer virus, Trojan horse, malicious program attack, network congestion, system instability, system or equipment failure, communication failure, power failure, bank or government action, etc.;<br>
(6) any other cause not attributable to us.<br>
3. We are not liable under any of the following circumstances:<br>
(1) The user's digital tokens are lost due to your loss of the mobile device, deletion and non-backup of Hermit, deletion and non-backup of wallet, forgetting and non-backup of wallet passwords, private keys, mnemonics, and Keystore;<br>
(2) Your digital tokens are lost as a result of the disclosure by you of the wallet password, private key, mnemonic, keystore, or the borrowing, transfer or authorization of others to use your mobile device or Hermit wallet, or the failure to download the Hermit application through our official channels or otherwise use the Hermit application in an unsafe manner;<br>
(3) Loss of digital token caused by your misoperation (including but not limited to the problem that you input the wrong transfer address and you choose the transfer node server yourself);<br>
(4) Your digital tokens are lost due to misoperation due to your lack of knowledge of blockchain technology;<br>
(5) We copy the user's transaction records on the block chain due to system lag, instability of the block chain system or other reasons;<br>
4. You shall bear the risks and consequences arising from or related to:<br>
(1) Transactions in which you operate using third-party services;<br>
(2) You use the developer mode;<br>
(3) If you use currency exchange services, such risks and consequences shall be borne by you, the other party to the transaction and the issuer of the relevant intelligent contract.<br>
5. You understand that Hermit is only a tool for your digital token management. We have no control over the quality, safety or legality of third party services, the authenticity or accuracy of information, or the ability of counterparties to perform their obligations under agreements with you. You are free to use third-party services. You understand that the transaction and the binding contractual relationship are established between you and your counterpart and are not ours. We remind you to carefully judge the authenticity, legality and validity of the relevant information provided by third-party services before using the third-party services. In addition, you shall be responsible for all risks arising from your dealings with any third party.<br>
6. You acknowledge that Hermit may provide services to, or be associated with, or otherwise related to, you and your counterparty, and you agree to expressly waive any actual or potential conflict of interest with respect to any such conduct that we may have, and shall not assert any legal flaw in the provision of our services or aggravate our liability or duty of care.<br>
7. We do not provide the following forms of assurance:<br>
(1) The services we provide will meet all your needs;<br>
(2) Any technology, product, service, information or other material you acquire through our services will meet your expectations;<br>
(3) The timeliness, accuracy, completeness and reliability of the trading quotations and other information of the digital token market obtained by us from the third party's exchanges;<br>
(4) Your counterparty at Hermit will promptly fulfill its obligations under the transaction agreement with you.<br>
8. In no event shall we be liable for breach of this Service Agreement for more than 1) 0.1 ethernet market value; or 2) Singapore $100, whichever is higher.<br>
9. You understand that Hermit is solely your tool for managing digital tokens and displaying transaction information and that we do not provide legal, tax or investment advice services. You should seek advice from legal, tax and investment professionals on your own, and we will not be responsible for any loss of investment or data you incur while using our services.<br>
10. You understand that in accordance with the requirements of applicable laws and regulations, we may from time to time change our user access criteria to limit the scope and method of providing services to specific users.<br>
X、 Other Provisions
1. Not transferable. Subject to the terms of this Service Agreement, only you (and not others) are entitled to claim against us for claims relating to the use of the Service. You may not assign, trade, or attempt to assign, trade your rights to the claim. Any such assignment shall be null and void and we bear no obligation or responsibility to the Transferee.<br>
2. Intellectual property rights. Hermit is an application that we develop and own intellectual property. Intellectual property rights pertaining to any content displayed in Hermit (including this Service Agreement, Notices, Articles, Videos, Audio, Pictures, Files, Information, Materials, Trademarks or Logos) are owned by us or third party rights holders. You may use the Hermit application and its contents only for the purposes of holding and managing digital tokens. Without the prior written consent of us or the third party right holder (or the permission of the relevant open source agreement), no one may use, modify, decompile, copy, publicly disseminate, change, distribute, distribute or publicly publish the aforesaid application and content (including Hermit open source code). This Service Agreement shall not be deemed to confer on you any intellectual property rights including the right to use for any purpose any information, pictures, user interface, logos, trademarks, trade names, domain names or copyrights relating to us or the Services.<br>
3. Non-waiver. Any failure by us to enforce this Service Agreement or to claim our rights, claims or causes of action under this Service Agreement shall not be deemed a waiver of any of our rights, claims or causes of action against you.<br>
4. Full agreement:<br>
(1) This Service Agreement comprises the Hermit Service Agreement, the Hermit Privacy Policy and such rules as we may from time to time publish (including the contents of the Help Center).<br>
(2) In addition to the Hermit Service Agreement and the Hermit Privacy Policy in this Service Agreement, this Service Agreement encompasses all agreements and understandings between us regarding the use of Hermit and related services and supersedes all previous (oral and written) agreements, understandings or arrangements.<br>
5. Tax:<br>
(1) The use of services under this Service Agreement does not include any taxes ("taxes payable") that you apply, generate or relate to your use of the Services in any jurisdiction.<br>
(2) You shall be responsible for determining any amount of tax payable and for filing, withholding, collecting, reporting and withholding the correct amount of tax payable to the appropriate tax authorities. You shall be liable for all penalties, claims, fines, penalties and other liabilities arising from your failure to complete or comply with any of your tax obligations.<br>
(3) We are not responsible for determining any amount of tax payable and are not responsible for filing, withholding, collecting, reporting and withholding the correct amount of tax payable to the appropriate tax authorities.<br>
6. Application of law. This Service Agreement shall be governed by and construed in accordance with the laws of the Republic of Singapore.<br>
7. Jurisdiction. Any dispute arising out of or in connection with this Service Agreement (including any issue relating to its existence, validity or termination) shall first be settled between the Parties. If the dispute remains unresolved within 30 (30) days after the commencement of the conciliation proceedings, the parties shall submit the dispute to the Singapore International Arbitration Centre (hereinafter referred to as the "SIAC") and settle the dispute by arbitration in Singapore in accordance with the Arbitration Rules of the Singapore International Arbitration Centre then in force (which is deemed to have been incorporated into this Article by reference). The arbitral tribunal shall consist of one arbitrator appointed by the Chairman of SIAC. The language of arbitration shall be English. Each Party irrevocably accepts the non- exclusive jurisdiction of the courts of Singapore to support and facilitate arbitral proceedings under the foregoing provisions of this paragraph, including the granting of interim relief (if necessary) pending the outcome of such proceedings.<br>
8. Contract (Rights of Third Parties) Act. The Republic of Singapore's Contract (Rights of Third Parties) Act (Cap. 53B) (which may be amended, amended or supplemented from time to time) shall apply to this Service Agreement. A person who is not a party to this Service Agreement shall not have any rights under this Service Agreement nor shall he be entitled to enforce this Service Agreement.<br>
9. Independence. Where any part of this Service Agreement is deemed to be invalid, illegal or unenforceable by any legislation binding this Service Agreement, it shall be deemed to be invalid, illegal or unenforceable only within that scope (and without further extension). For the avoidance of doubt, the remainder of this Service Agreement shall remain in force and in full force and effect.<br>
10. Partially invalid. Any provision of this Service Agreement that is found to be unlawful, invalid or unenforceable under the law of any jurisdiction shall not affect the legality, validity or enforceability of such provision under the law of any other jurisdiction, nor shall it affect the legality, validity or enforceability of any other provision of this Service Agreement.<br>
11. This Service Agreement is translated. Any translation of this Service Agreement (if any) is provided solely for your convenience and is not intended to be amended in English. In case of any conflict between the English and non-English versions of this Service Agreement, the English version shall prevail.<br>
XI、 Others<br>
1. You shall fully understand and abide by all relevant laws, regulations and rules concerning the use of services in your jurisdiction.<br>
2. If you encounter any problems while using the service, you can contact us by submitting feedback at Hermit.<br>
3. This Service Agreement is available to all users in Hermit. We encourage you to consult this Service Agreement every time you visit Hermit.<br>
4. For matters not covered in this Service Agreement, you are subject to our bulletins and relevant rules as updated from time to time.<br>
5. This Service Agreement shall enter into force as of September 3, 2022.<br>
For matters not covered by this policy, you are required to abide by the bulletin and related rules updated from time to time.`
  }
}
export default languages
