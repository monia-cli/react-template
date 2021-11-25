import { CodeGenerator, Interface } from 'pont-engine'

export default class MyGenerator extends CodeGenerator {
	getInterfaceContent(inter: Interface) {
		const bodyParmas = inter.getBodyParamsCode()
		const queryParamsType = 'IQueryParams'
		const queryParamsTmp = `queryParams:${queryParamsType}`
		const bodyParamsTmp = `bodyParams:${bodyParmas}`
		const paramsInterfaceTmp = `
    interface IParams{
      ${queryParamsTmp}
      ${bodyParmas ? bodyParamsTmp : ''}
    }
    `
		const requestParams = bodyParmas ? `{queryParams,bodyParams}` : `{queryParams}`

		const isUrlIncludesId = inter.path.includes('id')
		if (isUrlIncludesId && inter.path.includes('{')) {
			const { path, method } = inter
			const targetIndex = path.indexOf('{')
			const newPath = path.substring(0, targetIndex) + '$' + path.substring(targetIndex, path.length)
			if (method === 'get' || method === 'delete') {
				return `
        /**
         * @desc ${inter.description}
         */
        import request from '@src/utils/request'
        export function ${inter.name}(id: number | string) {
          return request({
            url: \`${newPath}\`,
            method: '${inter.method}'
          });
        }
       `
			} else {
				return `
        /**
         * @desc ${inter.description}
         */
        import request from '@src/utils/request'
        export ${inter.getParamsCode(queryParamsType)}
        export ${paramsInterfaceTmp}
        export function ${inter.name}(id: number | string, ${requestParams}:IParams = {} as IParams) {
          return request({
            url: \`${newPath}\`,
            method: '${inter.method}',
            ${bodyParmas ? 'body: bodyParams' : 'params: queryParams'}
          });
        }
       `
			}
		} else {
			return `
    /**
     * @desc ${inter.description}
     */
    import request from '@src/utils/request'
    export ${inter.getParamsCode(queryParamsType)}
    export ${paramsInterfaceTmp}
    export function ${inter.name}(${requestParams}:IParams = {} as IParams) {
      return request({
        url: \`${inter.path}\`,
        method: '${inter.method}',
        ${bodyParmas ? 'body: bodyParams' : 'params: queryParams'}
      });
    }
   `
		}
	}
}
