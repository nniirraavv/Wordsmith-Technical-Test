import * as path from "path";
import * as fs from "fs";

export class FileSystem {

	public static getSubDirectories(srcPath: string) {
		return fs.readdirSync(srcPath)
			.filter(file => fs.statSync(path.join(srcPath, file)).isDirectory())
			.map(file => path.join(srcPath, file))
	}

	public static readdirSyncRecursive(root: string, files: any[] = [], prefix: string = '') {
		let self = this,
			dir = path.join(root, prefix);
		if (!fs.existsSync(dir)) return files;
		if (fs.statSync(dir).isDirectory()) {
			fs.readdirSync(dir)
				.forEach(function (name) {
					files = self.readdirSyncRecursive(root, files, path.join(prefix, name))
				});
		} else {
			// @ts-ignore
			files.push(prefix);
		}

		return files;
	}
}
