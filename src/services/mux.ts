import Mux from "@mux/mux-node";

const mux = new Mux({ tokenId: process.env.NEXT_PUBLIC_muxTokenId, tokenSecret: process.env.NEXT_PUBLIC_muxTokenSecret });

export default mux;