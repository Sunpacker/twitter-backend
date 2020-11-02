import { createHash } from 'crypto'

const generateMD5 = (value: string): string => {
	return createHash('md5').update(value).digest('hex')
}

export default generateMD5
