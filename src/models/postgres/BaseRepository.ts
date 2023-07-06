import { PagedResult } from "../../types";
import { isNumber } from "lodash";
import { container, Provide } from "../../context/IocProvider";
import { Model } from "sequelize-typescript";
import { PostgresDB } from "../../context/components/PostgresDB";
import { FindAndCountOptions, Includeable, WhereOptions } from "sequelize/types/model";
import { Col, Fn, Literal } from "sequelize/types/utils";

@Provide(BaseRepository)
export abstract class BaseRepository<T extends Model<T>>{

    protected model: any;

    protected registerModel(model: any) {
        this.model = model;
    }

    getSequelizeInstance() {
        return container.get(PostgresDB).getInstance()
    }

    /**
     * Find a page of documents by conditions.
     */
    async findPage(conditions?: WhereOptions, sortBy?: Array<any> | Fn | Col | Literal, page?: number, pageSize?: number, options: FindAndCountOptions = {}): Promise<PagedResult<T>> {

        if (conditions)
            options['where'] = conditions;

        if (sortBy)
            options['order'] = sortBy;

        if (isNumber(page) && page > 0 && isNumber(pageSize) && pageSize > 0) {
            options['limit'] = pageSize;
            options['offset'] = (page - 1) * pageSize;
        }

        // needed to fix count when includes other models
        if (options && options.include && (options.include as Includeable[]).length > 0) {
            options['distinct'] = true;
        }

        return this.model.findAndCountAll(options)
            .then((result: { count: number, rows: Model<T>[]; }) => {
                return { items: result.rows, totalCount: result.count };
            });
    }

    getById(identifier: number): Promise<T> {
        return this.model.findByPk(identifier);
    }

    remove(identifier: number): Promise<number> {
        return this.model.destroy({
            where: { id: identifier }
        });
    }

}
