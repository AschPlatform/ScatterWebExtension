
export const Blockchains = {
    EOS:'eos',
    ETH:'eth',
    ASCH:'asch'
};

export const BlockchainsArray =
    Object.keys(Blockchains).map(key => ({key, value:Blockchains[key]}));