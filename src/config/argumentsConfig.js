import { Command } from "commander"

export const argumentss = new Command()

argumentss.option("--mode <mode>", "to specify mode", "dev")
argumentss.parse()